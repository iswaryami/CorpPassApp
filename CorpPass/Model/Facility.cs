using System.ComponentModel.DataAnnotations;

namespace CorpPass.Model
{
    public class Facility
    {

            [Key]
            public int FacilityId { get; set; }
            public string Name { get; set; }
            public string Type { get; set; }
            public int Capacity { get; set; }
            public string Location { get; set; }
            public string Amenities { get; set; }

           // public List<Booking> Bookings { get; set; }
        
    }
}
