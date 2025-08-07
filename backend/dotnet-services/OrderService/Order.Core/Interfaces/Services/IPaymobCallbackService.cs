using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shared.DTOS;
using Shared.PaymentProviders.Paymob;

namespace Order.Core.Interfaces.Services
{
    public interface IPaymobCallbackService
    {
        Task<ResultDto<bool>> ProcessTransactionCallbackAsync(PaymobCallbackDto callback, string hmac);
    }
}
