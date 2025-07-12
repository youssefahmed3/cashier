using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Order.Core.Enums;

namespace Order.Core.Entities
{
    public class SalesOrder
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime UpdatedAt { get; set; }

        public OrderStatus Status { get; set; }

        public decimal? Total => OrderItems?.Sum(item => item.TotalPrice);

        public ICollection<OrderItem>? OrderItems { get; set; }

        public Guid BranchId { get; set; }

        public Guid UserId {  get; set; } 

        public Guid ShiftId { get; set; }

        //payment 
        //Drawer Log 


    }
}
