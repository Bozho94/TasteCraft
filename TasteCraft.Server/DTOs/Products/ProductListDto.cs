namespace TasteCraft.Server.DTOs.Products
{
    public class ProductListDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal PricePerKg { get; set; }
        public string ImageUrl { get; set; } = null!;
    }
}
