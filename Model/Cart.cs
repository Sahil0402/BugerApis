using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BugerApis.Model
{
    public class Cart
    {

        public int Id { get; set; }
        public Guid UserId { get; set; } //from number login
        public string? BurgerName { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        public string? ImgHyperLink { get; set; }
        [Required]
        public int Quantity { get; set; }

        public override string ToString()
        {
            return $"{BurgerName} {Quantity} {Price}";
        }
    }
}
    