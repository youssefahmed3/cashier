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
        
        public long Id { get; set; } 
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime UpdatedAt { get; set; }

        public OrderStatus Status { get; set; }

        public decimal? Total => OrderItems?.Sum(item => item.TotalPrice);
        public long BranchId { get; set; }
        public long UserId {  get; set; } 

        public long ShiftId { get; set; }

        public bool IsDeleted { get; set; }

        public ICollection<Payment>? Payments { get; set; }
        public ICollection<OrderItem>? OrderItems { get; set; }

        //Drawer Log 


    }
}
