import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateBooking = () => {
    const [facilityId, setFacilityId] = useState('');
    const [visitorId, setVisitorId] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [status, setStatus] = useState('Pending');
    const [error, setError] = useState('');
    const [facilities, setFacilities] = useState([]);
    const [visitors, setVisitors] = useState([]);

    useEffect(() => {
        fetchFacilities();
        fetchVisitors();
    }, []);

    // Fetch available facilities
    const fetchFacilities = async () => {
        try {
            const response = await axios.get('https://localhost:7082/api/facilities');
            setFacilities(response.data);
        } catch (error) {
            console.error('Error fetching facilities:', error);
        }
    };

    // Fetch available visitors
    const fetchVisitors = async () => {
        try {
            const response = await axios.get('https://localhost:7082/api/visitor');
            setVisitors(response.data);
        } catch (error) {
            console.error('Error fetching visitors:', error);
        }
    };

    // Validate booking inputs
    const validateBooking = async () => {
        const currentDate = new Date();
        const selectedDate = new Date(bookingDate + 'T' + bookingTime);

        // Check if the selected date is in the past
        if (selectedDate < currentDate) {
            setError('Booking date must be in the future.');
            return false;
        }


        setError('');
        return true;
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        const formattedBookingTime = bookingTime ? `${bookingTime}:00` : '';
        const isValid = await validateBooking();

        if (!isValid) return;

        const booking = {
            facilityId,
            visitorId,
            bookingDate,
            formattedBookingTime,
            status,
        };

        try {
            const response = await axios.post('https://localhost:7082/api/booking', booking);
            console.log('Booking created successfully:', response.data);
        } catch (error) {
            console.error('Error creating booking:', error);
            setError('Failed to create booking.');
        }
    };

    return (
        <div>
            <h2>Create Booking</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Facility:</label>
                    <select value={facilityId} onChange={(e) => setFacilityId(e.target.value)} required>
                        <option value="">Select Facility</option>
                        {facilities.map(facility => (
                            <option key={facility.facilityId} value={facility.facilityId}>
                                {facility.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Visitor:</label>
                    <select value={visitorId} onChange={(e) => setVisitorId(e.target.value)} required>
                        <option value="">Select Visitor</option>
                        {visitors.map(visitor => (
                            <option key={visitor.visitorId} value={visitor.visitorId}>
                                {visitor.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Booking Date:</label>
                    <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Booking Time:</label>
                    <input
                        type="time"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Status:</label>
                    <input
                        type="text"
                        value={status}
                        readOnly
                    />
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit">Create Booking</button>
            </form>
        </div>
    );
};

export default CreateBooking;
