using BugerApis.Model;
using Microsoft.EntityFrameworkCore;

namespace BugerApis.Data
{
    public class BurgerDbContext:DbContext
    {
        public DbSet<PhoneNumber> PhoneNumbers { get; set; }
        public DbSet<Burger> Burgers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Cart> Carts {  get; set; } 
        public BurgerDbContext(DbContextOptions<BurgerDbContext> dbContextOptions):base(dbContextOptions)
        {
            
        }
    }
}
