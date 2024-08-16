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
    public class BurgersController : ControllerBase
    {
        private readonly BurgerDbContext _context;

        public BurgersController(BurgerDbContext context)
        {
            _context = context;
        }

        // GET: api/Burgers
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Burger>>> GetBurgers()
        {
            return await _context.Burgers.ToListAsync();
        }

        // GET: api/Burgers/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Burger>> GetBurger(int id)
        {
            var burger = await _context.Burgers.FindAsync(id);

            if (burger == null)
            {
                return NotFound();
            }

            return burger;
        }

        // PUT: api/Burgers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBurger(int id, Burger burger)
        {
            if (id != burger.Id)
            {
                return BadRequest();
            }

            _context.Entry(burger).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BurgerExists(id))
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

        [Authorize]
        // POST: api/Burgers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Burger>> PostBurger(Burger burger)
        {
            _context.Burgers.Add(burger);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBurger", new { id = burger.Id }, burger);
        }

        [Authorize]
        // DELETE: api/Burgers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBurger(int id)
        {
            var burger = await _context.Burgers.FindAsync(id);
            if (burger == null)
            {
                return NotFound();
            }

            _context.Burgers.Remove(burger);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Burgers/category/{category} // New method for category-based retrieval
        [Authorize]
        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<Burger>>> GetBurgersByCategory(string category)
        {
            var burgers = await _context.Burgers
                 .Where(b => b.SortCategory == category)
                 .ToListAsync();

            if (burgers == null || burgers.Count == 0)
            {
                return NotFound($"No burgers found for category: {category}");
            }

            return Ok(burgers);
        }

        [Authorize]
        [HttpGet("name/{name}")]
        public async Task<ActionResult<IEnumerable<Burger>>> GetBurgerByName(string name)
        {
            var burger = await _context.Burgers
                .Where(b => b.Name == name)
                .ToListAsync();

            if (burger == null || burger.Count == 0)
            {
                return NotFound($"No burger found for name: {name}");
            }

            return Ok(burger[0]);
        }

        private bool BurgerExists(int id)
        {
            return _context.Burgers.Any(e => e.Id == id);
        }
    }
}
