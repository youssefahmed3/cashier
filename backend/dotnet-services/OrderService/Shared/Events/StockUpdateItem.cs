namespace Shared.Events
{
    public class StockUpdateItem
    {
        public long ProductId { get; set; }
        public decimal Quantity { get; set; }
    }
}