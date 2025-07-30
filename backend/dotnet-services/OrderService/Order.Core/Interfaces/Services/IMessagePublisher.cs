using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shared.DTOS;

namespace Order.Core.Interfaces.Services
{
    public interface IMessagePublisher
    {
        Task<ResultDto<bool>> PublishEventSafelyAsync<T>(T message, string queueName = null) where T : class;
    }

}
