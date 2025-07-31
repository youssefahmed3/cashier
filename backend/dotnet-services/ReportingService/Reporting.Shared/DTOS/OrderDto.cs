using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Reporting.Shared.DTOS
{
    public class OrderDto
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string? Status { get; set; }
        public decimal Ammount { get; set; }
        public string? method { get; set; }
        public int? transactionId { get; set; }
        public string? referance { get; set; }
        public int orderId { get; set; }
        public int branchId { get; set; }
        public int shiftId { get; set; }

    }
}
