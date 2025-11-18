namespace TasteCraft.Server.DTOs.Categories
{
    public class CategoryCreateOrEditDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
    }
}
