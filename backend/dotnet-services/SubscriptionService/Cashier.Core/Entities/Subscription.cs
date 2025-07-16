using System.Security.Cryptography.X509Certificates;

namespace Cashier
{
    public class Subscription
    {
        internal object Subscriptions;

        public int Id { get; set; }
        public int Sub_Id { get; set; }
        public bool IsActive { get; set; }
        public DateTime ExpireDate { get; set; }
        public int price { get; set; }

        internal async Task SaveChangesAsync(CancellationToken stoppingToken)
        {
            throw new NotImplementedException();
        }
    }
}
