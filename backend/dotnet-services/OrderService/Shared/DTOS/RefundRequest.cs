using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace Shared.DTOS
{
    public class RefundRequest
    {
        public long PaymentId { get; init; }
        public string? TransactionId  { get; init; }

        public decimal Amount { get; init; }
    }
}
