using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTOS
{
    public class PaymentDto
    {
        public long Id { get; set; }
        public decimal Amount { get; set; }
        public string Method { get; set; }
        public string Status { get; set; }
        public string? TransactionId { get; set; }

        public string? Reference { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        //ref
        public long OrderId { get; set; }
        public long BranchId { get; set; }
        public long ShiftId { get; set; }
    }
}
