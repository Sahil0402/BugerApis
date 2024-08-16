using System.ComponentModel.DataAnnotations.Schema;

namespace BugerApis.Model
{
    public class Order
    {
        public int OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public Guid UserId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }
        public ICollection<OrderItem>? OrderItems { get; set; } = new List<OrderItem>();
    }
}
