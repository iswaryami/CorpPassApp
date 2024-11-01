using CorpPass.Model;
using Microsoft.EntityFrameworkCore;

namespace CorpPass.Data
{
    public class BookingDbContext : DbContext
    {
        public BookingDbContext(DbContextOptions<BookingDbContext> options) : base(options) { }

        public DbSet<Facility> Facilities { get; set; }
        public DbSet<Booking> Booking { get; set; }
        public DbSet<Visitor> Visitor { get; set; }

    }
}
