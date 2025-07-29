using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Shift.Core.Interfaces.Repositories;
using Shift.Core.Interfaces.Services;
using Shift.Infrastructure.Data;
using Shift.Infrastructure.Data.Configurations;
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

            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped<IShiftRepository, ShiftRepository>();
            builder.Services.AddScoped<IDrawerLogRepository, DrawerLogRepository>();
            builder.Services.AddScoped(typeof(IGenericRepository<,>), typeof(GenericRepository<,>));
            
            builder.Services.AddScoped<IShiftService, ShiftService>();
            builder.Services.AddAutoMapper(typeof(ShiftMappingProfile).Assembly);


            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();
            builder.Services.AddMassTransit(x =>
            {
                x.AddConsumer<DrawerLogEventConsumer>(configurator =>
                {
                    configurator.UseMessageRetry(r => r.Exponential(5, TimeSpan.FromSeconds(1), TimeSpan.FromSeconds(30), TimeSpan.FromSeconds(2)));
                });

                x.UsingRabbitMq((context, cfg) =>
                {
                    cfg.Host("rabbitmq", "/", h =>
                    {
                        h.Username("guest");
                        h.Password("guest");
                    });

                    cfg.ReceiveEndpoint("shift-service-drawer-logs", e =>
                    {
                        e.ConfigureConsumer<DrawerLogEventConsumer>(context);
                    });
                });
            });

            builder.Services.AddMassTransitHostedService();
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

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
