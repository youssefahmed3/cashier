

namespace Reporting.Core.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string? Status { get; set; }
        public decimal Ammount { get; set; }
        public string? method { get; set; }
        public int? transactionId { get; set; }
        public string? referance { get; set; }
        public int orderId { get; set; }
        public int branchId { get; set; }
        public int shiftId { get; set; }
    }
}
