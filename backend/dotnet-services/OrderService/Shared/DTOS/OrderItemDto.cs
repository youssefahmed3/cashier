namespace Shared.DTOS
{
    public class OrderItemDto
    {
        public long Id { get; set; }
        public long ProductId { get; init; }
        public decimal Quantity { get; init; }
        public decimal UnitPrice { get; init; }
        public long OrderId { get; init; }
    }
}