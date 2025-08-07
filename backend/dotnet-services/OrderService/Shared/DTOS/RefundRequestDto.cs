using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace Shared.DTOS
{
    public class RefundRequestDto
    { 
        public long OrderId { get; set; }
        public long BranchId { get; set; }
        public long ShiftId { get; set; }
        public string? Reason { get; set; }
        public List<RefundItemDto> Items { get; set; } = new List<RefundItemDto>();
    }
}
