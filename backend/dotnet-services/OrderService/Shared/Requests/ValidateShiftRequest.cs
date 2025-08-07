using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Requests
{
    public class ValidateShiftRequest
    {
        public long ShiftId { get; set; }
        public long UserId { get; set; }
    }
}
