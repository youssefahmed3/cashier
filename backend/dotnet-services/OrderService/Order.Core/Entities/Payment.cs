using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using Order.Core.Enums;

namespace Order.Core.Entities
{
    //Are we in refund return item to inventory 
    // if the cashier that do the refund different => should i  update payment to have cahierId for tracking
    public class Payment
    {
        public long Id { get; set; } 
        public decimal Amount { get; set; }
        public PaymentMethod Method { get; set; }
        public PaymentStatus Status { get; set; }
        public string? TransactionId { get; set; }

        public string? Reference { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        //ref
        public long? OrderId { get; set; }
        public long BranchId { get; set; }
        public long ShiftId { get; set; }

        // CashierId ==> if system extend maybe it the user
        //public long UserId { get; set; }
        public virtual SalesOrder? Order { get; set; }

    }
}
