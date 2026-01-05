namespace TasteCraft.Server.DTOs.Products
{
    public class ProductListDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal PricePerUnit { get; set; }
        public string ImageUrl { get; set; } = null!;
        public string Description { get; set; } = null!;
    }
}
