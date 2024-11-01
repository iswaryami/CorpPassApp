using CorpPass.Controllers;
using CorpPass.Data;
using CorpPass.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookingTest.Test
{
    public class BookingTest
    {
        private readonly Mock<BookingDbContext> _mockContext; // Adjust according to your context
        private readonly BookingController _controller;

        public BookingTest()
        {
            // Initialize the mock context and the controller
            var options = new DbContextOptionsBuilder<BookingDbContext>()
    .UseInMemoryDatabase("DefaultConnection").Options;
            _mockContext = new Mock<BookingDbContext>(new DbContextOptions<BookingDbContext>());

            _controller = new BookingController(_mockContext.Object);
        }

        [Fact]
        public async Task CreateBooking_BookingDateInPast_ReturnsBadRequest()
        {
            var options = new DbContextOptionsBuilder<BookingDbContext>()
     .UseInMemoryDatabase(databaseName: "TestDatabase")
     .Options;
            using (var context = new BookingDbContext(options))
            {
                // Seed the database with facilities and visitors
                context.Facilities.Add(new Facility { FacilityId = 1 });
                context.Visitor.Add(new Visitor { VisitorId = 1 });
                await context.SaveChangesAsync();
            }

            using (var context = new BookingDbContext(options))
            {
                var controller = new BookingController(context);

                // Act
                var result = await controller.CreateBooking(new Booking
                {
                    BookingId = 0,
                    FacilityId = 1,
                    VisitorId = 1,
                    BookingDate = DateTime.Now.AddDays(-1), // Past date
                    BookingTime = new TimeSpan(14, 0, 0), // Example time
                    Status = "Confirmed"
                });


                // Assert
                var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
                var message = Assert.IsType<Dictionary<string, string>>(badRequestResult.Value);
                Assert.Equal("Booking date cannot be in the past.", message["message"]);

            }
        }

        [Fact]
        public async Task CreateBooking_NonExistentVisitor_ReturnsBadRequest()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<BookingDbContext>()
.UseInMemoryDatabase(databaseName: "TestDatabase")
.Options;
            var context = new BookingDbContext(options);
            context.Facilities.Add(new Facility
            {
                FacilityId = 1,
                Name = "Conference Room",
                Location = "Building A",
                Type = "Room",
                Amenities = "Projector, Whiteboard" // Provide all required properties
            });
            //context.Facilities.Add(new Facility { FacilityId = 1 });
            await context.SaveChangesAsync();

            var booking = new Booking
            {
                FacilityId = 1,
                VisitorId = 99, // Non-existent visitor
                BookingDate = DateTime.Now.AddDays(1),
                BookingTime = new TimeSpan(14, 0, 0),
                Status = "Confirmed"
            };

            // Act
            var result = await _controller.CreateBooking(booking);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("Visitor does not exist.", badRequestResult.Value);
        }


        [Fact]
        public async Task CreateBooking_DoubleBooking_ReturnsBadRequest()
        {

            var options = new DbContextOptionsBuilder<BookingDbContext>()
.UseInMemoryDatabase(databaseName: "TestDatabase")
.Options;
            var context = new BookingDbContext(options);
            // Arrange
            context.Facilities.Add(new Facility { FacilityId = 1 });
            context.Visitor.Add(new Visitor { VisitorId = 1 });
            await context.SaveChangesAsync();

            // First booking
            var firstBooking = new Booking
            {
                FacilityId = 1,
                VisitorId = 1,
                BookingDate = DateTime.Now.AddDays(1),
                BookingTime = new TimeSpan(14, 0, 0),
                Status = "Confirmed"
            };
            await _controller.CreateBooking(firstBooking); // Create the first booking

            // Second booking (double booking)
            var secondBooking = new Booking
            {
                FacilityId = 1,
                VisitorId = 2, // Different visitor
                BookingDate = DateTime.Now.AddDays(1),
                BookingTime = new TimeSpan(14, 0, 0), // Same time
                Status = "Confirmed"
            };

            // Act
            var result = await _controller.CreateBooking(secondBooking);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("The selected facility is already booked for the specified date and time.", ((dynamic)badRequestResult.Value).message);
        }
    }
}
