using CorpPass.Data;
using CorpPass.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CorpPass.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : Controller
    {
        private readonly BookingDbContext _context;

        public BookingController(BookingDbContext context)
        {
            //_context = context;
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        /// <summary>
        /// Get a single booking
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        // GET: api/booking/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBooking(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new { message = "Invalid booking ID provided." });
                }

                var booking = await _context.Booking
                    .FirstOrDefaultAsync(b => b.BookingId == id);

                if (booking == null)
                {
                    return NotFound(new { message = $"Booking with ID {id} not found." });
                }
                return Ok(booking);
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode(500, new { message = "A database error occurred.", details = dbEx.Message });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        /// <summary>
        /// Create a Booking
        /// </summary>
        /// <param name="booking"></param>
        /// <returns></returns>
        // POST: api/booking
        [HttpPost]
        public async Task<ActionResult<Booking>> CreateBooking(Booking booking)
        {
            try
            {

                if (!await _context.Facilities.AnyAsync(f => f.FacilityId == booking.FacilityId))
                {
                    return BadRequest("Facility does not exist.");
                }

                if (!await _context.Visitor.AnyAsync(v => v.VisitorId == booking.VisitorId))
                {
                    return BadRequest("Visitor does not exist.");
                }

                if (booking.BookingDate.Date < DateTime.Now.Date)
                {
                    return BadRequest(new { message = "Booking date cannot be in the past." });
                }
                bool isAlreadyBooked = await _context.Booking.AnyAsync(b =>
                    b.FacilityId == booking.FacilityId &&
                    b.BookingDate.Date == booking.BookingDate.Date &&
                    b.BookingTime == booking.BookingTime);
                if (isAlreadyBooked)
                {
                    return BadRequest(new { message = "The selected facility is already booked for the specified date and time." });
                }

                _context.Booking.Add(booking);

                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetBooking), new { id = booking.BookingId }, booking);
            }
            catch (DbUpdateException dbEx)
            {

                return StatusCode(500, new { message = "A database error occurred.", details = dbEx.Message });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        /// <summary>
        /// Update a Booking
        /// </summary>
        /// <param name="booking"></param>
        /// <returns></returns>
        // PUT: api/booking
        [HttpPut]
        public async Task<IActionResult> UpdateBooking(int id, Booking booking)
        {
            if (id != booking.BookingId)
            {
                return BadRequest(new { message = "The booking ID in the URL does not match the booking ID in the body." });
            }

            if (!BookingExists(booking.BookingId))
            {
                return NotFound(new { message = "Booking not found." });
            }

            if (!await _context.Facilities.AnyAsync(f => f.FacilityId == booking.FacilityId))
            {
                return BadRequest("Facility does not exist.");
            }

            if (!await _context.Visitor.AnyAsync(v => v.VisitorId == booking.VisitorId))
            {
                return BadRequest("Visitor does not exist.");
            }
            try
            {
                _context.Entry(booking).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict(new { message = "The booking was updated by another user. Please try again." });
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode(500, new { message = "A database error occurred.", details = dbEx.Message });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }


        /// <summary>
        /// Get all booking list
        /// </summary>
        /// <returns>booking list</returns>
        // GET: api/bookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetAllBookings()
        {
            try
            {
                var bookings = await _context.Booking
                    .ToListAsync();
                if (bookings == null || bookings.Count == 0)
                {
                    return NoContent(); 
                }
                return Ok(bookings);
            }
            catch (DbUpdateException dbEx)
            {

                return StatusCode(500, new { message = "A database error occurred.", details = dbEx.Message });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        /// <summary>
        /// Get Bookings By Visitor
        /// </summary>
        /// <param name="visitorId"></param>
        /// <returns></returns>
        // GET: api/bookings/visitor/{visitorId}
        [HttpGet("visitor/{visitorId}")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookingsByVisitorId(int visitorId)
        {
            try
            {
                var bookings = await _context.Booking
                    .Where(b => b.VisitorId == visitorId)
                    .ToListAsync();

                if (bookings == null || !bookings.Any())
                {
                    return NotFound();
                }
                return Ok(bookings);
            }
            catch (DbUpdateException dbEx)
            {

                return StatusCode(500, new { message = "A database error occurred.", details = dbEx.Message });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        private bool BookingExists(int id)
        {
            return _context.Booking.Any(e => e.BookingId == id);
        }


    }
}
