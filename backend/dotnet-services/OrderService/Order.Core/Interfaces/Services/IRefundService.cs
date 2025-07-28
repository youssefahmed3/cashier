using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shared.DTOS;

namespace Order.Core.Interfaces.Services
{
    public interface IRefundService
    {
        Task<ResultDto<RefundDto>> ProcessRefundAsync(RefundRequestDto refundRequest);
        Task<ResultDto<decimal>> GetOrderRefundedAmountAsync(long orderId);
    }
}
