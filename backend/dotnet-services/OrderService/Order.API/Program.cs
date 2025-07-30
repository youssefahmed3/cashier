using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.OpenApi.Models;
using Order.Core.Interfaces.Repositories;
using Order.Core.Interfaces.Services;
using Order.Core.Interfaces.Strategies;
using Order.Infrastructure.Data;
using Order.Infrastructure.Data.Configurations;
using Order.Infrastructure.Extensions;
using Order.Infrastructure.Repositories;
using Order.Infrastructure.Services;
using Order.Infrastructure.Settings;
using Order.Infrastructure.Strategies;
using Order.Services.Mapping;
using Order.Services.Services;
using Shared.DTOS;

namespace Order.API
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
                    Title = "Order API",
                    Version = "v1"
                });
            });

            builder.Services.ConfigureDbService(builder.Configuration);
            builder.Services.Configure<PaymobSettings>(builder.Configuration.GetSection("PaymobSettings"));
            builder.Services.AddHttpContextAccessor();
            builder.Services.ConfigureMassTransitWithRabbitMq(builder.Configuration);
            builder.Services.AddScoped<IPaymentEventPublisher, PaymentEventPublisher>();
            builder.Services.AddScoped<IRefundEventPublisher,  RefundEventPublisher>();
            builder.Services.AddHttpClient<IPaymobService, PaymobService>();

            builder.Services.AddScoped(typeof(IGenericRepository<,>), typeof(GenericRepository<,>));
            builder.Services.AddScoped<IOrderRepository, OrderRepository>();
            builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
            builder.Services.AddScoped<IRefundRepository, RefundRepository>();
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

            builder.Services.AddScoped<IOrderService<OrderDto, long, ResultDto<OrderDto>>, OrderService>();
            builder.Services.AddScoped<IOrderItemService, OrderItemService>();
            builder.Services.AddScoped<IPaymentService, PaymentService>();
            builder.Services.AddScoped<IRefundService, RefundService>();
            builder.Services.AddScoped<IUserContextService, UserContextService>();
            builder.Services.AddScoped<IValidationService, ValidationService>();

            builder.Services.AddScoped<IPaymentStrategy, CashPaymentStrategy>();
            builder.Services.AddScoped<IPaymentStrategy, PaymobPaymentStrategy>();

            builder.Services.AddAutoMapper(typeof(OrderMappingProfile).Assembly);
            builder.Services.AddAutoMapper(typeof(PaymentMappingProfile).Assembly);
            builder.Services.AddAutoMapper(typeof(RefundMappingProfile).Assembly);

            builder.Services.AddControllers();
            builder.Services.AddOpenApi();

            var app = builder.Build();

            // === Apply DB Migrations ===
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var dbContext = services.GetRequiredService<OrderDbContext>();
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

            // === Configure HTTP Pipeline ===
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwagger();
                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Order API V1");
                    options.RoutePrefix = string.Empty;
                });
            }

            app.UseAuthorization();
            app.MapControllers();
            app.MapGet("/ping", () => "pong");

            app.Run();
        }
    }
}
