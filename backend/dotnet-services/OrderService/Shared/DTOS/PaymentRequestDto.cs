using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTOS
{
    public class PaymentRequestDto
    {
        public Guid OrderId { get; set; }
        public decimal Amount { get; set; }

        //PayPal - Cash 
        public string  PaymentMethod { get; set; }

        public Guid BranchId { get; set; }

        //TODO: See if it better to get it with req or from backend 
        public Guid CashierId { get; set; }
        public string? Reference { get; set; }
    }
}
