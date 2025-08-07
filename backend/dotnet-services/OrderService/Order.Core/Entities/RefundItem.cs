namespace Order.Core.Entities
{
    public class RefundItem
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public decimal UnitPrice { get; set; }

        public decimal Quantity { get; set; }

        public decimal TotalPrice => Quantity * UnitPrice;

        public long RefundId { get; set; }
        public long OrderItemId { get; set; }
        public long ProductId { get; set; }


        public virtual Refund? Refund { get; set; }
        public virtual OrderItem? OrderItem { get; set; }

    }
}