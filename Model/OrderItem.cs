using System.ComponentModel.DataAnnotations.Schema;

namespace BugerApis.Model
{
    public class OrderItem
    {
        public int OrderItemId { get; set; }          
        public int OrderId { get; set; }               
        public string? Name { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }             
        public string? Type { get; set; }               
        public int Quantity { get; set; }              
        public string? ImageUrl { get; set; }           
        public Order? Order { get; set; }
    }
}
