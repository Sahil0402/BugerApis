using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BugerApis.Model
{
    public class Burger
    {
        [Key]
        public int Id { get; set; }

        [Required] 
        public string? Name { get; set; }

        [Required]
        public string? ImgHyperLink { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        [Required]
        public decimal? Price { get; set; }

        [Required]
        public string? Description { get; set; }

        [Required]
        public string? SortCategory { get; set;}
    }
}
