using Shared.DTOS;

namespace Order.Core.Interfaces.Services
{
    public interface IPaymentService
    {
        Task<ResultDto<PaymentDto>> GetPaymentByIdAsync(long paymentId);
        Task<ResultDto<IEnumerable<PaymentDto>>> GetPaymentsByOrderIdAsync(long orderId);
        Task<ResultDto<PaymentDto>> ProcessPaymentAsync(PaymentRequestDto request);
        Task<ResultDto<PaymentDto>> RefundPaymentAsync(long paymentId, decimal amount);
    }
}