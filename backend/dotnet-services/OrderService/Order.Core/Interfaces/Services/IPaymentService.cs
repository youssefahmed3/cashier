using Shared.DTOS;

namespace Order.Core.Interfaces.Services
{
    public interface IPaymentService
    {
        Task<ResultDto<PaymentDto>> GetPaymentByIdAsync(Guid paymentId);
        Task<ResultDto<IEnumerable<PaymentDto>>> GetPaymentsByOrderIdAsync(Guid orderId);
        Task<ResultDto<PaymentDto>> ProcessPaymentAsync(PaymentRequestDto request);
        Task<ResultDto<PaymentDto>> RefundPaymentAsync(Guid paymentId, decimal amount);
    }
}