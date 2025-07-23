using Reporting.Core.Entities;

public class OrderItem
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int OrderId { get; set; }
    public int Qty { get; set; }
    public decimal TotalPrice { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation Properties
    public required Product Product { get; set; }
    public required Order Order { get; set; }
}
