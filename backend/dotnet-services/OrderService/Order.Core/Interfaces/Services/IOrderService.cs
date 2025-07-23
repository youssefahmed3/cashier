using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Order.Core.Enums;
using Order.Core.Interfaces.Repositories;

namespace Order.Core.Interfaces.Services
{
    public interface IOrderService<TEntity, TKey, TResult> where TEntity : class
    {

        Task<TResult> CreateOrderAsync(TEntity orderDto);
        Task<TResult> GetOrderByIdAsync(TKey orderId);
        Task<TResult> UpdateOrderStatusAsync(TKey orderId , string status);

    }
}
