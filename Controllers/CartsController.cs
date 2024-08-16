using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BugerApis.Data;
using BugerApis.Model;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;

namespace BugerApis.Controllers
{
    [EnableCors("MyCorsPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    public class CartsController : ControllerBase
    {
        private readonly BurgerDbContext _context;

        public CartsController(BurgerDbContext context)
        {
            _context = context;
        }

        private static List<Cart> _carts = new List<Cart>(); // This is just a placeholder for demonstration

        [Authorize]
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Cart>>> GetCartItems(Guid userId)
        {
            var cartItems = await _context.Carts.Where(c => c.UserId == userId).ToListAsync();
            cartItems.ForEach((cartItem) =>
            {
                Console.WriteLine(cartItem);
            });
            if (cartItems.Count == 0)
            {
                return NotFound("No items found in the cart for this user.");
            }

            return cartItems;
        }

        // GET: api/Carts/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Cart>> GetCartByCartId(int id)
        {
            var cart = await _context.Carts.FindAsync(id);

            if (cart == null)
            {
                return NotFound();
            }

            return cart;
        }

        // PUT: api/Carts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutCart(int id, Cart cart)
        {
            if (id != cart.Id)
            {
                return BadRequest();
            }

            _context.Entry(cart).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CartExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Carts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Cart>> PostCart(Cart cart)
        {
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCartByCartId", new { id = cart.Id }, cart);
        }

        // DELETE: api/Carts/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCart(int id)
        {
            var cart = await _context.Carts.FindAsync(id);
            if (cart == null)
            {
                return NotFound();
            }

            _context.Carts.Remove(cart);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("user/{userId}")]
        [Authorize]
        public async Task<IActionResult> ClearCart(Guid userId)
        {
            var cartItems = await _context.Carts.Where(c => c.UserId == userId).ToListAsync();
            if (cartItems.Count == 0)
            {
                return NotFound("No items found in the cart.");
            }

            _context.Carts.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            return NoContent(); // Successfully cleared the cart
        }

        private bool CartExists(int id)
        {
            return _context.Carts.Any(e => e.Id == id);
        }
    }
}
