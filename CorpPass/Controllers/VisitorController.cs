using CorpPass.Data;
using CorpPass.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CorpPass.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VisitorController : Controller
    {
        private readonly BookingDbContext _context;

        public VisitorController(BookingDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all Visitors
        /// </summary>
        /// <returns></returns>
        // GET: api/visitors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Visitor>>> GetVisitors()
        {
            try
            {
                var visitors = await _context.Visitor.ToListAsync();
                if (visitors == null || !visitors.Any())
                {
                    return NotFound(new { message = "No visitors found." });
                }
                return Ok(visitors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Get visitor id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        // GET: api/visitors/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Visitor>> GetVisitor(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new { message = "Invalid visitor ID provided." });
                }
                var visitor = await _context.Visitor.FindAsync(id);

                if (visitor == null)
                {
                    return NotFound(new { message = $"Visitor with ID {id} not found." });
                }

                return Ok(visitor); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Create a visitor
        /// </summary>
        /// <param name="visitor"></param>
        /// <returns></returns>
        // POST: api/visitor
        [HttpPost]
        public async Task<ActionResult<Visitor>> CreateVisitor(Visitor visitor)
        {

            if (string.IsNullOrEmpty(visitor.Name) || string.IsNullOrEmpty(visitor.Email) || string.IsNullOrEmpty(visitor.PhoneNumber))
            {
                return BadRequest(new { message = "Name, Email, and Phone Number are required." });
            }


            if (await _context.Visitor.AnyAsync(v => v.Email == visitor.Email))
            {
                return Conflict(new { message = "A visitor with the same email already exists." });
            }

            try
            {
                _context.Visitor.Add(visitor);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetVisitor), new { id = visitor.VisitorId }, visitor);
            }
            catch (DbUpdateException ex)
            {
                Console.Error.WriteLine($"Error creating visitor: {ex.Message}");

                return StatusCode(500, new { message = "An error occurred while saving the visitor. Please try again later." });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Unexpected error: {ex.Message}");

                return StatusCode(500, new { message = "An unexpected error occurred. Please try again later." });
            }
        }

        /// <summary>
        /// Update a Visitor
        /// </summary>
        /// <param name="visitor"></param>
        /// <returns></returns>
        // PUT: api/visitor
        [HttpPut]
        public async Task<IActionResult> UpdateVisitor(int id, Visitor visitor)
        {

            if (visitor.VisitorId <= 0)
            {
                return BadRequest(new { message = "Invalid Visitor ID." });
            }

            if (string.IsNullOrEmpty(visitor.Name) || string.IsNullOrEmpty(visitor.Email) || string.IsNullOrEmpty(visitor.PhoneNumber))
            {
                return BadRequest(new { message = "Name, Email, and Phone Number are required." });
            }

            if (!await VisitorExists(visitor.VisitorId))
            {
                return NotFound(new { message = $"Visitor with ID {visitor.VisitorId} not found." });
            }

            try
            {
                _context.Entry(visitor).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await VisitorExists(visitor.VisitorId))
                {
                    return NotFound(new { message = $"Visitor with ID {visitor.VisitorId} was not found during update." });
                }
                else
                {
                    return StatusCode(500, new { message = "A concurrency error occurred while updating the visitor. Please try again." });
                }
            }
            catch (Exception ex)
            {

                Console.Error.WriteLine($"Unexpected error: {ex.Message}");

                return StatusCode(500, new { message = "An unexpected error occurred. Please try again later." });
            }
        }

        /// <summary>
        /// Helper method to check if a visitor exists
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        private async Task<bool> VisitorExists(int id)
        {
            return await _context.Visitor.AnyAsync(v => v.VisitorId == id);
        }
    }
}
