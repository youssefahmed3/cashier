namespace Reporting.core.Entities
{
    public class Stock
    {
        internal object Stocks;

        public int Id { get; set; }
        public int BatchId { get; set; }
        public int Qty { get; set; }
        public int Discount { get; set; }
        public string Location { get; set; }
        public DateTime PurchDate { get; set; }
        public DateTime ExpiryDate { get; set; }

        internal async Task SaveChangesAsync(CancellationToken stoppingToken)
        {
            throw new NotImplementedException();
        }
    }
}
