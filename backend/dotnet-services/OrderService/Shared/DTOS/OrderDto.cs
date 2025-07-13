using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Shared.DTOS
{
    public class OrderDto
    {
        public long OrderId { get; init; }
        public long BranchId { get; init; }
        public long UserId { get; init; }
        public long ShiftId { get; init; }
        public string Status { get; init; } = "New";
        public List<OrderItemDto> Items { get; init; } = [];
    }
}
