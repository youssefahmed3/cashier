using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Requests
{
    public class ValidationResponse
    {
        public bool IsValid { get; init; }
        public string? ErrorMessage { get; init; }
    } 
}
