using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Shared.PaymentProviders.Paymob
{
    public class PaymobBillingData
    {

        [JsonProperty("first_name")]
        public string First_Name { get; set; }

        [JsonProperty("last_name")]
        public string Last_Name { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("phone_number")]
        public string Phone_Number { get; set; }

    }
}
