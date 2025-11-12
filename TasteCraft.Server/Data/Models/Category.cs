using System.ComponentModel.DataAnnotations;
using static TasteCraft.Server.EntityConstraints.ValidationConst.Category;

namespace TasteCraft.Server.Data.Models
{
    public class Category
    {

        public int Id { get; set; }

        [Required]
        [MaxLength(NameMaxLength)]
        public string Name { get; set; } = null!;

        [MaxLength(DescriptionMaxLength)]
        public string? Description { get; set; }
        public bool IsDeleted { get; set; }
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
