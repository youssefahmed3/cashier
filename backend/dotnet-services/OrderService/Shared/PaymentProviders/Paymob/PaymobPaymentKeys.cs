using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.PaymentProviders.Paymob
{
    public class PaymobPaymentKeys
    {
        public int Integration {  get; set; }
        public string Key { get; set; }

        public string Gateway_Type { get; set; }
        public int? Iframe_Id { get; set; }
        public int Order_Id { get; set; }
    }
}
