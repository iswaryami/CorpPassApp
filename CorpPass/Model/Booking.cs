using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CorpPass.Model
{
    public class Booking
    {
        [Key]
        public int BookingId { get; set; }
        public int FacilityId { get; set; }
        public int VisitorId { get; set; }
        public DateTime BookingDate { get; set; }
        public TimeSpan BookingTime { get; set; }
        public string Status { get; set; }

        //[ForeignKey("FacilityId")]
        //public Facility Facility { get; set; }

        //[ForeignKey("VisitorId")]
        //public Visitor Visitor { get; set; }
    }
}
