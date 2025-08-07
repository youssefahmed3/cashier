using System;
using System.Collections.Generic;
using System.Linq;
using MassTransit;
using MassTransit.Transports;
using Microsoft.Extensions.Logging;
using Shift.Core.Interfaces.Services;

namespace Shift.Infrastructure.Services
{
    public class MessagePublisher : IMessagePublisher
    {
        private readonly IPublishEndpoint _publishEndpoint;
        private readonly ISendEndpointProvider _sendEndpointProvider;
        private readonly ILogger<MessagePublisher> _logger;

        public MessagePublisher(
            IPublishEndpoint publishEndpoint,
            ISendEndpointProvider sendEndpointProvider,
            ILogger<MessagePublisher> logger)
        {
            _publishEndpoint = publishEndpoint;
            _sendEndpointProvider = sendEndpointProvider;
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

        public async Task PublishToQueueAsync<T>(T message, string queueName, CancellationToken cancellationToken = default) where T : class
        {
            try
            {
                var endpoint = await _sendEndpointProvider.GetSendEndpoint(new Uri($"queue:{queueName}"));
                await endpoint.Send(message, cancellationToken);
                _logger.LogInformation("Sent message {MessageType} to queue {QueueName}", typeof(T).Name, queueName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send message {MessageType} to queue {QueueName}", typeof(T).Name, queueName);
                throw;
            }
        }
    }
}
