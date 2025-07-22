

namespace Reporting.Core.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? Status { get; set; }
        public int Total { get; set; }

        // Navigation Properties
        public ICollection<OrderItem> OrderItems { get; set; }

    }
}
