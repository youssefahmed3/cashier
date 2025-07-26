using Microsoft.Extensions.Configuration;
using Microsoft.OpenApi.Models;
using Order.Core.Interfaces.Repositories;
using Order.Core.Interfaces.Services;
using Order.Core.Interfaces.Strategies;
using Order.Infrastructure.Data.Configurations;
using Order.Infrastructure.Extensions;
using Order.Infrastructure.Repositories;
using Order.Infrastructure.Services;
using Order.Infrastructure.Settings;
using Order.Infrastructure.Strategies;
using Order.Services.Mapping;
using Order.Services.Services;
using Shared.DTOS;
using static System.Net.Mime.MediaTypeNames;

namespace Order.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            // builder.WebHost.UseUrls("http://0.0.0.0:8080");
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Order API",
                    Version = "v1"
                });
            });

            //Add Db Service 
            builder.Services.ConfigureDbService(builder.Configuration);
            builder.Services.Configure<PaymobSettings>(builder.Configuration.GetSection("PaymobSettings"));
            builder.Services.AddHttpContextAccessor();
            //builder.Services.Configure<RabbitMQSettings>(builder.Configuration.GetSection("RabbitMQSettings"));
            builder.Services.ConfigureMassTransitWithRabbitMq(builder.Configuration);
            builder.Services.AddScoped<IPaymentEventPublisher, PaymentEventPublisher>();

            builder.Services.AddHttpClient<IPaymobService, PaymobService>();

            //if we used unit of work we will only register it 
            builder.Services.AddScoped(typeof(IGenericRepository<,>), typeof(GenericRepository<,>));
            builder.Services.AddScoped<IOrderRepository, OrderRepository>();
            builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

            builder.Services.AddScoped<IOrderService<OrderDto, long, ResultDto<OrderDto>>, OrderService>();
            builder.Services.AddScoped<IOrderItemService, OrderItemService>();
            builder.Services.AddScoped<IPaymentService, PaymentService>();
            builder.Services.AddScoped<IUserContextService, UserContextService>();

            builder.Services.AddScoped<IPaymentStrategy, CashPaymentStrategy>();
            builder.Services.AddScoped<IPaymentStrategy, PaymobPaymentStrategy>();
            builder.Services.AddAutoMapper(typeof(OrderMappingProfile).Assembly);
            builder.Services.AddAutoMapper(typeof(PaymentMappingProfile).Assembly);
            


            // Add services to the container.
            builder.Services.AddControllers();

            builder.Services.AddOpenApi();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
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

           // app.UseHttpsRedirection();
            app.UseAuthorization();

            app.MapControllers();

            // Add this line:
            app.MapGet("/ping", () => "pong");

            app.Run();
        }
    }
}
