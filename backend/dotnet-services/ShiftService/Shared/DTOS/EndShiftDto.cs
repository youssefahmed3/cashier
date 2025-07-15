using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTOS
{
    public class EndShiftDto
    {
        public long ShiftId { get; set; }
        public decimal EndingCash { get; set; }
    }
}
