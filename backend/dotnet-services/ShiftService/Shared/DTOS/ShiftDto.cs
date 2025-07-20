using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTOS
{
    public class ShiftDto
    {
        public long? Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public decimal StartingCash { get; set; }
        public decimal? EndingCash { get; set; }
        public decimal? ExpectedCash { get; set; }
        public decimal? CashDifference { get; set; }
        public bool IsActive { get; set; }

        public long UserId { get; set; }
        public long BranchId { get; set; }

        public List<DrawerLogDto>? DrawerLogs { get; set; }
    }
}
