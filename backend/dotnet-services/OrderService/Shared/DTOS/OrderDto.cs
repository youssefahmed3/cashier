using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Shared.DTOS
{
    public class OrderDto
    {
        public Guid OrderId { get; init; }
        public Guid BranchId { get; init; }
        public Guid UserId { get; init; }
        public Guid ShiftId { get; init; }
        public string Status { get; init; } = "New";
        public List<OrderItemDto> Items { get; init; } = [];
    }
}
