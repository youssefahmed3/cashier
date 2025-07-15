using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTOS
{
    public class StartShiftDto
    {
        public required long UserId { get; set; }
        public required long BranchId { get; set; }
        public required  decimal StartingCash { get; set; }
    }
}
