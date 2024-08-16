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
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace BugerApis.Controllers
{
    [EnableCors("MyCorsPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    public class PhoneNumbersController : ControllerBase
    {
        private readonly BurgerDbContext _context;
        private readonly IConfiguration _configuration;

        public PhoneNumbersController(BurgerDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/PhoneNumbers
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PhoneNumber>>> GetPhoneNumbers()
        {
            return await _context.PhoneNumbers.ToListAsync();
        }

        [HttpGet("login/{phNumber}")]
        public async Task<IActionResult> Login(string phNumber)
        {
            var user = await _context.PhoneNumbers.FirstOrDefaultAsync(x => x.MobileNumber == phNumber);
            if (user == null)
            {
                return NotFound();
            }
            else
            {
                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                    new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
                    new Claim("UserId", user.Id.ToString())
                };
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(
                    _configuration["Jwt:Issuer"],
                    _configuration["Jwt:Audience"],
                    claims,
                    expires: DateTime.UtcNow.AddMinutes(60),
                    signingCredentials: signIn
                );
                string tokenValue = new JwtSecurityTokenHandler().WriteToken(token);
                return Ok(new { Token = tokenValue, User = user });
            }
        }

        // GET: api/PhoneNumbers/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<PhoneNumber>> GetPhoneNumber(Guid id)
        {
            var phoneNumber = await _context.PhoneNumbers.FindAsync(id);

            if (phoneNumber == null)
            {
                return NotFound();
            }

            return phoneNumber;
        }

        // PUT: api/PhoneNumbers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPhoneNumber(Guid id, PhoneNumber phoneNumber)
        {
            if (id != phoneNumber.Id)
            {
                return BadRequest();
            }

            _context.Entry(phoneNumber).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PhoneNumberExists(id))
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

        // POST: api/PhoneNumbers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PhoneNumber>> PostPhoneNumber(PhoneNumber phoneNumber)
        {
            _context.PhoneNumbers.Add(phoneNumber);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPhoneNumber", new { id = phoneNumber.Id }, phoneNumber);
        }

        // DELETE: api/PhoneNumbers/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoneNumber(Guid id)
        {
            var phoneNumber = await _context.PhoneNumbers.FindAsync(id);
            if (phoneNumber == null)
            {
                return NotFound();
            }

            _context.PhoneNumbers.Remove(phoneNumber);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("exists/{mobileNumber}")]
        public async Task<IActionResult> CheckPhoneNumberExists(string mobileNumber)
        {
            var exists = await _context.PhoneNumbers.AnyAsync(p => p.MobileNumber == mobileNumber);
            return Ok(exists); // Returns true or false
        }

        [Authorize]
        [HttpGet("getId/{mobileNumber}")]
        public async Task<IActionResult> GetUserIdFromNumber(string mobileNumber)
        {
            // Find the phone number record based on the provided mobile number
            var phoneNumber = await _context.PhoneNumbers
                .Where(p => p.MobileNumber == mobileNumber)
                .Select(p => new { p.Id }) // Select only the ID
                .FirstOrDefaultAsync();

            if (phoneNumber == null)
            {
                return NotFound(); // Return 404 if not found
            }

            return Ok(phoneNumber.Id); // Return the ID if found
        }

        private bool PhoneNumberExists(Guid id)
        {
            return _context.PhoneNumbers.Any(e => e.Id == id);
        }
    }
}
