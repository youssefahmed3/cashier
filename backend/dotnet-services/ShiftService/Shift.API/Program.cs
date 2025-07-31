using MassTransit;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Shift.API.Extensions;
using Shift.API.Middleware;
using Shift.Core.Interfaces.Repositories;
using Shift.Core.Interfaces.Services;
using Shift.Infrastructure.Data;
using Shift.Infrastructure.Data.Configurations;
using Shift.Infrastructure.Extensions;
using Shift.Infrastructure.Repositories;
using Shift.Services.Mapping;
using Shift.Services.Services;

namespace Shift.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Shift API",
                    Version = "v1"
                });
            });

            // Add services to the container.
            builder.Services.ConfigureDbService(builder.Configuration);
            builder.Services.AddAuthentication("CustomJwt")
                            .AddScheme<AuthenticationSchemeOptions, CustomJwtAuthenticationHandler>("CustomJwt", options => { });
            builder.Services.AddAuthorization();

            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped<IShiftRepository, ShiftRepository>();
            builder.Services.AddScoped<IDrawerLogRepository, DrawerLogRepository>();
            builder.Services.AddScoped(typeof(IGenericRepository<,>), typeof(GenericRepository<,>));
            
            builder.Services.AddScoped<IShiftService, ShiftService>();
            builder.Services.AddAutoMapper(typeof(ShiftMappingProfile).Assembly);


            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();
            builder.Services.ConfigureMassTransitWithRabbitMq(builder.Configuration);
            builder.Services.AddHttpClient<ITokenValidationClient, TokenValidationClient>(client =>
            {
                var baseUrl = builder.Configuration["ServicesURLs:BaseUrl"];
                if (!string.IsNullOrEmpty(baseUrl))
                {
                    client.BaseAddress = new Uri(baseUrl);
                }
                client.Timeout = TimeSpan.FromSeconds(30);
            });
            var app = builder.Build();

            // === Apply DB Migrations ===
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var dbContext = services.GetRequiredService<ShiftDbContext>();
                    var logger = services.GetRequiredService<ILogger<Program>>();

                    if (dbContext.Database.GetPendingMigrations().Any())
                    {
                        logger.LogInformation("Applying database migrations...");
                        dbContext.Database.Migrate();
                        logger.LogInformation("Database migrations applied successfully.");
                    }
                    else
                    {
                        logger.LogInformation("No pending migrations found.");
                    }
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occurred while migrating the database.");
                }
            }
            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseJwtAuthentication();  
            app.UseAuthentication();     
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
