using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.PaymentProviders.Paymob
{
    public class PaymobCallbackDto
    {
        public string Type { get; set; }
        public PaymobTransactionObj Obj { get; set; }
    }
}
