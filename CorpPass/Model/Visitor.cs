using System.ComponentModel.DataAnnotations;

namespace CorpPass.Model
{
    public class Visitor
    {
        [Key]
        public int VisitorId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public string? Address { get; set; }

       // public List<Booking> Bookings { get; set; }
    }
}
