using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Order.Core.Interfaces.Services
{
    public interface IMessagePublisher
    {
        Task PublishAsync<T>(T message, CancellationToken cancellationToken = default) where T : class;
    }

}
