using Newtonsoft.Json;

namespace Shared.PaymentProviders.Paymob
{
    public class PaymobIntentionRequest
    {

        [JsonProperty("amount")]
        public decimal Amount { get; set; }

        [JsonProperty("currency")]
        public string Currency { get; set; }

        [JsonProperty("billing_data")]
        public PaymobBillingData Billing_Data { get; set; }

        [JsonProperty("payment_methods")]
        public int[] Payment_Methods { get; set; }

        [JsonProperty("notification_url")]
        public string Notification_Url { get; set; }

        [JsonProperty("redirection_url")]
        public string Redirection_Url { get; set; }

        [JsonProperty("expiration")]
        public int? Expiration { get; set; }

        [JsonProperty("extras")]
        public PaymobExtras? Extras { get; set; }

        [JsonProperty("special_reference")]
        public string Special_Reference { get; set; }
    }

}


