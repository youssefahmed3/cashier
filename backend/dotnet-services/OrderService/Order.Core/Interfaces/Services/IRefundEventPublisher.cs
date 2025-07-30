using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Order.Core.Entities;
using Shared.DTOS;

namespace Order.Core.Interfaces.Services
{
    public interface IRefundEventPublisher
    {
        Task<ResultDto<bool>> PublishRefundEventsAsync(Payment refundPayment, Payment originalPayment, decimal amount);
        Task<ResultDto<bool>> PublishStockRestockEventsAsync(Refund refund, Payment originalPayment, List<RefundItem> refundItems);

    }
}
