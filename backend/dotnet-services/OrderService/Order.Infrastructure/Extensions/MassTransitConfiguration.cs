using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Order.Core.Interfaces.Services;
using Order.Infrastructure.Services;
using Order.Infrastructure.Settings;
using Shared.Requests;



namespace Order.Infrastructure.Extensions
{
    public static class MassTransitConfiguration
    {

        public static IServiceCollection ConfigureMassTransitWithRabbitMq(this IServiceCollection services, IConfiguration configuration)
        {
           // services.Configure<RabbitMQSettings>(configuration.GetSection(RabbitMQSettings.SectionName));

            var rabbitMQSettings = configuration
                                    .GetSection(RabbitMQSettings.SectionName)
                                    .Get<RabbitMQSettings>()
                                    ?? throw new InvalidOperationException("RabbitMQ config is missing");

            services.AddMassTransit(x =>
            {
                // Add request clients
                x.AddRequestClient<ValidateBranchRequest>();
                x.AddRequestClient<ValidateInventoryRequest>();
                x.AddRequestClient<ValidateShiftRequest>();

                x.UsingRabbitMq((context, cfg) =>
                {
                    cfg.Host(new Uri($"rabbitmq://{rabbitMQSettings.HostName}:{rabbitMQSettings.Port}/{rabbitMQSettings.VirtualHost}"), h =>
                    {
                        h.Username(rabbitMQSettings.UserName);
                        h.Password(rabbitMQSettings.Password);
                    });

                    // Configure retry policy  
                    cfg.UseMessageRetry(r =>
                    {
                        r.Exponential(rabbitMQSettings.RetryLimit,
                            TimeSpan.FromMilliseconds(rabbitMQSettings.RetryInterval),
                            TimeSpan.FromMinutes(5),
                            TimeSpan.FromSeconds(5));
                    });

                    cfg.ConfigureEndpoints(context);
                });
            });

            services.AddScoped<IMessagePublisher, MessagePublisher>();

            return services;
        }
    }
}
