namespace Shared.DTOS
{
    public class OrderItemDto
    {
        public Guid? Id { get; set; }
        public Guid ProductId { get; init; }
        public decimal Quantity { get; init; }
        public decimal UnitPrice { get; init; }
        public Guid OrderId { get; init; }
    }
}