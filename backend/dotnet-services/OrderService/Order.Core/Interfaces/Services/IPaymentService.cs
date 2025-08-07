using Order.Core.Entities;
using Shared.DTOS;

namespace Order.Core.Interfaces.Services
{
    public interface IPaymentService
    {
        Task<ResultDto<PaymentDto>> GetPaymentByIdAsync(long paymentId);
        Task<ResultDto<IEnumerable<PaymentDto>>> GetPaymentsByOrderIdAsync(long orderId);
        Task<ResultDto<PaymentDto>> ProcessPaymentAsync(PaymentRequestDto request);
        Task<ResultDto<IEnumerable<PaymentDto>>> GetAllPaymentsAsync(DateTime? fromDate = null, DateTime? toDate = null);
        Task<ResultDto<IEnumerable<PaymentDto>>> GetPaymentsByBranchIdAsync(long branchId, DateTime? fromDate = null, DateTime? toDate = null);
    }
}