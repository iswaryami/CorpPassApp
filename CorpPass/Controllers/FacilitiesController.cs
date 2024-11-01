using CorpPass.Data;
using CorpPass.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CorpPass.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacilitiesController : ControllerBase
    {
        private readonly BookingDbContext _context;
        public FacilitiesController(BookingDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// List all facilities
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Facility>>> GetFacilities()
        {
            try
            {
                var facilities = await _context.Facilities.ToListAsync();
                return Ok(facilities);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while retrieving facilities.");
            }
        }

        /// <summary>
        /// Get a single facility
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFacilityById(int id)
        {
            var facility = await _context.Facilities.FindAsync(id);

            if (facility == null)
            {
                return NotFound(new { message = $"Facility with ID {id} not found." });
            }

            return Ok(facility);
        }


    }
}
