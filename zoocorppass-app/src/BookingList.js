import React, { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import axios from 'axios';

//import React, { useState } from 'react';

function BookingList() {

    const [bookings, setBookings] = useState([]); // Stores all facilities
    const [booking, setBooking] = useState(null);   // Stores single facility
    const [error, setError] = useState(null);
    const [bookingId, setBookingId] = useState('');

    // Fetch all facilities
    const fetchAllFacilities = async () => {
        try {
            const response = await fetch("https://localhost:7082/api/booking");
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

            const data = await response.json();
            setBookings(data);
            setBooking(null); // Clear any single facility data
        } catch (error) {
            setError(error.message);
        }
    };

    // Fetch a single facility by ID
    const fetchFacilityById = async (id) => {
        try {
            const response = await fetch(`https://localhost:7082/api/booking/${id}`);
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

            const data = await response.json();
            setBooking(data);
            setBookings([]); // Clear all facilities data
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h2>Booking</h2>
            <div>
                <button onClick={fetchAllFacilities}>Get All Booking</button>
                <input
                    type="text"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)} // Update ID on input change
                    placeholder="Enter Booking ID"
                />
                <button onClick={() => fetchFacilityById(bookingId)}>Get Booking by ID</button> {/* Replace 1 with the desired ID */}
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {bookings.length > 0 && (
                <ul>
                    {bookings.map(booking => (
                        <li key={booking.id}>{booking.visitorId}</li> // Assumes facility has an id and name
                    ))}
                </ul>
            )}

            {booking && (
                <div>
                    <h3>Booking Details</h3>
                    <p><strong>ID:</strong> {booking.bookingId}</p>
                    <p><strong>FacilityID:</strong> {booking.facilityId}</p>
                    <p><strong>VisitorId:</strong> {booking.visitorId}</p>
                    <p><strong>Date:</strong> {booking.bookingDate}</p>
                    <p><strong>Status:</strong> {booking.status}</p>

                </div>
            )}
        </div>
    );
}

export default BookingList;

