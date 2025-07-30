using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Events
{
    public class FraudDetectedEvent
    {
        public long ShiftId { get; set; }
        public long UserId { get; set; }
        public long BranchId { get; set; }
        public decimal CashDifference { get; set; }
        public string Notes { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
