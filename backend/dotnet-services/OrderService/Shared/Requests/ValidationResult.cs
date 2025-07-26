using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Requests
{
    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public List<string> Errors { get; set; } = new();
        public bool BranchValid { get; set; }
        public bool InventoryValid { get; set; }
        public bool ShiftValid { get; set; }
    }
}
