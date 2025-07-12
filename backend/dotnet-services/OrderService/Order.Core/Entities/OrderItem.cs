using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Order.Core.Entities
{
    public class OrderItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public decimal UnitPrice { get; set; }

        public decimal Qty { get; set; }

        public decimal TotalPrice => Qty *  UnitPrice;

        public Guid OrderId { get; set; }

        public Guid ProductId { get; set; }
        
    }
}
