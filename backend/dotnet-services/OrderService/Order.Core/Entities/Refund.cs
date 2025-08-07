using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Order.Core.Enums;

namespace Order.Core.Entities
{
    public class Refund
    {
        public long Id { get; set; }
        public decimal Amount { get; set; }
        public string? Reason { get; set; }
        public TransactionStatus Status { get; set; }
        public string? TransactionId { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        //ref
        public long? OrderId { get; set; }
        public long BranchId { get; set; }
        public long ShiftId { get; set; }

        public long PaymentId { get; set; }
        public virtual SalesOrder? Order { get; set; }
        public virtual Payment Payment { get; set; }
        public virtual ICollection<RefundItem> RefundItems { get; set; } = new List<RefundItem>();
    }
}
