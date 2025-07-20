using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shared.DTOS;
using Shared.PaymentProviders.Paymob;

namespace Order.Core.Interfaces.Services
{
    public interface IPaymobService
    {
        public Task<ResultDto<string>> GetAuthTokenAsync();
        public Task<ResultDto<PaymobIntentionResponse>> CreateIntentionAsync(PaymobIntentionRequest request);
        public Task<ResultDto<PaymobTransactionResponse>> GetTransactionIdAsync(string specialReference);

        public Task<ResultDto<PaymobRefundResponse>> RefundPaymentAsync(long originalTransactionId, decimal amount);
    }
}
