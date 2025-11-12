using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static TasteCraft.Server.EntityConstraints.ValidationConst.Product;
namespace TasteCraft.Server.Data.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(NameMaxLength)]
        public string Name { get; set; } = null!;

        [Required]
        [MaxLength(DescriptionMaxLength)]
        public string Description { get; set; } = null!;

        [Precision(10, 2)]
        public decimal PricePerKg { get; set; }

        [Required]
        public string ImageUrl { get; set; } = null!;

        public int CategoryId { get; set; }

        public bool IsDeleted { get; set; }

        [ForeignKey(nameof(CategoryId))]  
        public Category Category { get; set; } = null!;

    }
}
