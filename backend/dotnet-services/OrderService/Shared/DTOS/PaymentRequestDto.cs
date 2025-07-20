using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTOS
{
    public class PaymentRequestDto
    {
        public long OrderId { get; set; }
        public decimal Amount { get; set; }

        public string  PaymentMethod { get; set; }

        public long BranchId { get; set; }

        //TODO: See if it better to get it with req or from backend 
        public long CashierId { get; set; }

        public long CustomerId { get; set; }
        public string? Reference { get; set; }


    }
}
