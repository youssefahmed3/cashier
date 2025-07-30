namespace Shared.DTOS
{
    public class RefundItemDto
    {
        public long OrderItemId { get; set; }
        public decimal Quantity { get; set; }
        public long ProductId { get; set; }
    }
}