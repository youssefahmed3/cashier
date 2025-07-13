using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Order.Core.Entities;
using Order.Core.Enums;
using Shared.DTOS;

namespace Order.Core.Interfaces.Strategies
{
    public interface IPaymentStrategy
    {
        PaymentMethod SupportedPaymentMethod { get; }
        Task<ResultDto<Payment>> ProcessPaymentAsync(PaymentRequestDto paymentRequestDto);
        Task<ResultDto<Payment>> RefundPaymentAsync(Guid paymentId,decimal amount);

    }
}
