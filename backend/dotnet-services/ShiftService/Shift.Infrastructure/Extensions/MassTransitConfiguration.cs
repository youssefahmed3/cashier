using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Shift.Core.Interfaces.Services;
using Shift.Infrastructure.Services;
using Shift.Infrastructure.Settings;



namespace Shift.Infrastructure.Extensions
{
    public static class MassTransitConfiguration
    {

        public static IServiceCollection ConfigureMassTransitWithRabbitMq(this IServiceCollection services, IConfiguration configuration)
        {
            var rabbitMQSettings = configuration
                                    .GetSection(RabbitMQSettings.SectionName)
                                    .Get<RabbitMQSettings>()
                                    ?? throw new InvalidOperationException("RabbitMQ config is missing");

            services.AddMassTransit(x =>
            {
                // Register consumers
                x.AddConsumer<DrawerLogEventConsumer>(configurator =>
                {
                    configurator.UseMessageRetry(r =>
                        r.Exponential(5, TimeSpan.FromSeconds(1), TimeSpan.FromSeconds(30), TimeSpan.FromSeconds(2)));
                });

                x.UsingRabbitMq((context, cfg) =>
                {
                    // Configure RabbitMQ host
                    cfg.Host(new Uri($"rabbitmq://{rabbitMQSettings.HostName}:{rabbitMQSettings.Port}/{rabbitMQSettings.VirtualHost}"), h =>
                    {
                        h.Username(rabbitMQSettings.UserName);
                        h.Password(rabbitMQSettings.Password);
                    });

                    cfg.UseMessageRetry(r =>
                    {
                        r.Exponential(rabbitMQSettings.RetryLimit,
                            TimeSpan.FromMilliseconds(rabbitMQSettings.RetryInterval),
                            TimeSpan.FromMinutes(5),
                            TimeSpan.FromSeconds(5));
                    });

                    // Configure receive endpoint for the consumer
                    cfg.ReceiveEndpoint("shift-service-drawer-logs", e =>
                    {
                        e.ConfigureConsumer<DrawerLogEventConsumer>(context);
                    });

                    cfg.ConfigureEndpoints(context); 
                });
            });

            services.AddScoped<IMessagePublisher, MessagePublisher>();
           // services.AddMassTransitHostedService();

            return services;
        }
    }
}
