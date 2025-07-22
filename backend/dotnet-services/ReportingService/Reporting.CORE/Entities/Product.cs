public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string Barcode { get; set; }
    public string ImgUrl { get; set; }
    public double TaxRate { get; set; }
    public bool IsActive { get; set; }

    // Navigation Properties
    public ICollection<OrderItem> OrderItems { get; set; }
}
