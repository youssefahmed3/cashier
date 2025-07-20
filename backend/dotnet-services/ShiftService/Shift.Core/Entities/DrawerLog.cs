using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using Shift.Core.Enums;

namespace Shift.Core.Entities
{
    public class DrawerLog
    {
        public long Id { get; set; }
        public decimal Amount { get; set; }
        public TransactionType TransactionType { get; set;}
        public string? Reference { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.MinValue;
        public long ShiftId { get; set; }
        public long BranchId { get; set; }
        public long? PaymentId { get; set; }

        public Shift? Shift { get; set; }

    }
}
