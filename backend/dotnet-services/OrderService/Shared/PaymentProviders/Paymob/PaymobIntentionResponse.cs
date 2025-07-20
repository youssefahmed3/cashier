using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Shared.PaymentProviders.Paymob
{
    public class PaymobIntentionResponse
    {
        public string Id { get; set; }
        public string Client_Secret { get; set; }
        public List<PaymobPaymentKeys> Payment_Keys { get; set; }
        public DateTime Created { get; set; }
        public string Status { get; set; }

        [JsonProperty("special_reference")]
        public string Special_Reference { get; set; }

    }

}
