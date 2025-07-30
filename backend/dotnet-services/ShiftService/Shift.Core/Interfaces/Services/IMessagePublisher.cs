using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shift.Core.Interfaces.Services
{
    public interface IMessagePublisher
    {
        Task PublishAsync<T>(T message, CancellationToken cancellationToken = default) where T : class;
        Task PublishToQueueAsync<T>(T message, string queueName, CancellationToken cancellationToken = default) where T : class;

    }

}
