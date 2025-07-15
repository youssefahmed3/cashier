
using Microsoft.OpenApi.Models;
using Shift.Core.Interfaces.Repositories;
using Shift.Core.Interfaces.Services;
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

            var app = builder.Build();

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
