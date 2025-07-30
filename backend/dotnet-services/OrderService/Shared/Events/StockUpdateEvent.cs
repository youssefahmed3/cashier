using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Events
{
    public class StockUpdateEvent
    {
        public string EventType { get; set; } // "StockDecrease" or "StockRestock"
        public long BranchId { get; set; }
        public List<StockUpdateItem> Items { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string Reference { get; set; }
        public long? OrderId { get; set; }
        public long RefundId { get; set; }
    }
}
