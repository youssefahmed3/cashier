using System;
using System.Collections.Generic;
using System.Linq;
using MassTransit;
using Microsoft.Extensions.Logging;
using Order.Core.Interfaces.Services;

namespace Order.Infrastructure.Services
{
    public class MessagePublisher : IMessagePublisher
    {
        private readonly IPublishEndpoint _publishEndpoint;
        private readonly ILogger<MessagePublisher> _logger;

        public MessagePublisher(IPublishEndpoint publishEndpoint, ILogger<MessagePublisher> logger)
        {
            _publishEndpoint = publishEndpoint;
            _logger = logger;
        }

        public async Task PublishAsync<T>(T message, CancellationToken cancellationToken = default) where T : class
        {
            try
            {
                await _publishEndpoint.Publish(message, cancellationToken);
                _logger.LogInformation("Published message {MessageType}", typeof(T).Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to publish message {MessageType}", typeof(T).Name);
                throw;
            }
        }
    }

}
