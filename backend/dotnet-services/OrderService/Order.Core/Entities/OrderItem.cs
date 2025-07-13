using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Order.Core.Entities
{
    public class OrderItem
    {
        public long Id { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public decimal UnitPrice { get; set; }

        public decimal Qty { get; set; }

        public decimal TotalPrice => Qty *  UnitPrice;

        public long OrderId { get; set; }

        public long ProductId { get; set; }
        
    }
}
