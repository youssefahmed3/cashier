using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Order.Core.Entities;
using Shared.DTOS;

namespace Order.Core.Interfaces.Services
{
    public interface IPaymentEventPublisher
    {
        Task<ResultDto<bool>> PublishPaymentEventsAsync(Payment payment, PaymentRequestDto request, int shiftId);
        Task<ResultDto<bool>> PublishRefundEventsAsync(Payment refundPayment, Payment originalPayment, decimal amount);
    }
}
