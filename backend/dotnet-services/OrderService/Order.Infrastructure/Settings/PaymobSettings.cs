using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Order.Infrastructure.Settings
{
    public class PaymobSettings
    {
        public string BaseUrl { get; set; }
        public string AuthEndpoint { get; set; }
        public string IntentionEndpoint { get; set; }
        public string IframePath { get; set; }
        public string UnifiedCheckoutPath { get; set; }
        public string ApiKey { get; set; }
        public string SecretKey { get; set; }
        public string PublicKey { get; set; }
        public string MerchantId { get; set; }
        public string IframeUrl { get; set; }
        public string HmacSecret { get; set; }
        public int CardIntegrationId { get; set; }
        public string NotificationUrl { get; set; }
        public string RedirectionUrl { get; set; }
        public string Currency { get; set; }
        public int ExpirationSeconds { get; set; }

    }
}
