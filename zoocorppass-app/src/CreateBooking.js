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

        // Check for double booking
        //const response = await axios.get(`https://localhost:7082/api/bookings?facilityId=${facilityId}&bookingDate=${bookingDate}`);
        //if (response.data.length > 0) {
        //    setError('This facility is already booked for the selected date and time.');
        //    return false;
        //}

        setError('');
        return true;
    };

    // Handle form submission
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
            // Reset form or handle successful booking
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




////import React, { useState, useEffect } from 'react';

////function CreateBooking({ onSave }) {
////    const [visitors, setVisitors] = useState([]);
////    const [facilities, setFacilities] = useState([]);
////    const [formData, setFormData] = useState({
////        bookingId: 0,  // Fixed to 0 for new bookings
////        visitorId: '',
////        facilityId: '',
////        bookingDate: '',
////        bookingTime: '',
////        status: 'Pending'
////    });

////    useEffect(() => {
////        fetchVisitors();
////        fetchFacilities();
////    }, []);

////    const fetchVisitors = async () => {
////        try {
////            const response = await fetch('https://localhost:7082/api/visitor');
////            if (!response.ok) {
////                throw new Error('Network response was not ok');
////            }
////            const data = await response.json();
////            setVisitors(data);
////        } catch (error) {
////            console.error('Failed to fetch visitors:', error);
////        }
////    };

////    const fetchFacilities = async () => {
////        try {
////            const response = await fetch('https://localhost:7082/api/facilities');
////            if (!response.ok) {
////                throw new Error('Network response was not ok');
////            }
////            const data = await response.json();
////            setFacilities(data);
////        } catch (error) {
////            console.error('Failed to fetch facilities:', error);
////        }
////    };

////    const handleChange = (e) => {
////        const { name, value } = e.target;
////        setFormData((prevData) => ({ ...prevData, [name]: value }));
////    };

////    const handleSubmit = async (e) => {
////        e.preventDefault();

////        const payload = {
////            bookingId: 0, // Set to 0 as it will be generated by the API
////            facilityId: parseInt(formData.facilityId, 10), // Parse to integer
////            visitorId: parseInt(formData.visitorId, 10), // Parse to integer
////            bookingDate: new Date(formData.bookingDate).toISOString(), // Convert to ISO string
////            bookingTime: formData.bookingTime, // Keep as string for TimeSpan
////            status: formData.status,
////        };

////        try {
////            const response = await fetch('https://localhost:7082/api/booking', {
////                method: 'POST',
////                headers: {
////                    'Content-Type': 'application/json',
////                },
////                body: JSON.stringify(payload),
////            });

////            if (!response.ok) {
////                throw new Error('Failed to create booking');
////            }

////            // Optionally handle the response if needed
////            const result = await response.json();
////            console.log('Booking created successfully:', result);

////            onSave(); // Call the onSave function to refresh or close the form
////        } catch (error) {
////            console.error('Error creating booking:', error);
////        }
////    };

////    return (
////        <form onSubmit={handleSubmit}>
////            <label>Visitor:</label>
////            <select name="visitorId" value={formData.visitorId} onChange={handleChange} required>
////                <option value="">Select Visitor</option>
////                {visitors.map((visitor) => (
////                    <option key={visitor.visitorId} value={visitor.visitorId}>
////                        {visitor.Name}
////                    </option>
////                ))}
////            </select>

////            <label>Facility:</label>
////            <select name="facilityId" value={formData.facilityId} onChange={handleChange} required>
////                <option value="">Select Facility</option>
////                {facilities.map((facility) => (
////                    <option key={facility.facilityId} value={facility.facilityId}>
////                        {facility.Name}
////                    </option>
////                ))}
////            </select>

////            <label>Booking Date:</label>
////            <input
////                type="date"
////                name="bookingDate"
////                value={formData.bookingDate}
////                onChange={handleChange}
////                required
////            />

////            <label>Booking Time:</label>
////            <input
////                type="string"
////                name="bookingTime"
////                value={formData.bookingTime}
////                onChange={handleChange}
////                placeholder="HH:mm" // Placeholder to guide users
////                required
////            />

////            <label>Status:</label>
////            <select name="status" value={formData.status} onChange={handleChange} required>
////                <option value="Pending">Pending</option>
////                <option value="Confirmed">Confirmed</option>
////                <option value="Cancelled">Cancelled</option>
////            </select>

////            <button type="submit">Create Booking</button>
////        </form>
////    );
////}

////export default CreateBooking;


////import React, { useState, useEffect } from 'react';

////function CreateBooking({ bookingId = null, onSave }) {
////    const [visitors, setVisitors] = useState([]);
////    const [facilities, setFacilities] = useState([]);
////    const [formData, setFormData] = useState({
////        visitorId: '',
////        facilityId: '',
////        bookingDate: '',
////        bookingTime: '',
////        status: 'Pending'
////    });

////    useEffect(() => {
////        fetchVisitors();
////        fetchFacilities();

////        if (bookingId) {
////            fetchBookingDetails(bookingId);
////        }
////    }, [bookingId]);

////    const fetchVisitors = async () => {
////        try {
////            // Replace with your visitor API endpoint
////            const response = await fetch('https://localhost:7082/api/visitor');
////            if (!response.ok) {
////                throw new Error('Network response was not ok');
////            }

////            const data = await response.json();
////            setVisitors(data);
////        }
////        catch (error) {
////            console.error('Failed to fetch visitors:', error);
////        } finally {
////            //setLoading(false); // Stop loading after data fetch
////        }
////    };

////    const fetchFacilities = async () => {
////        // Replace with your facility API endpoint
////        const response = await fetch('https://localhost:7082/api/facilities');
////        const data = await response.json();
////        setFacilities(data);
////    };

////    const fetchBookingDetails = async (id) => {
////        const response = await fetch(`https://localhost:7082/api/booking/${id}`);
////        const data = await response.json();
////        setFormData({
////            visitorId: data.visitorId,
////            facilityId: data.facilityId,
////            bookingDate: data.bookingDate,
////            bookingTime: data.bookingTime,
////            status: data.status
////        });
////    };

////    const handleChange = (e) => {
////        const { name, value } = e.target;
////        setFormData((prevData) => ({ ...prevData, [name]: value }));
////    };

////    const handleSubmit = async (e) => {
////        e.preventDefault();
////        const url = bookingId
////            ? 'https://localhost:7082/api/booking/${bookingId}'
////            : 'https://localhost:7082/api/booking';
////        const method = bookingId ? 'PUT' : 'POST';

////        await fetch(url, {
////            method,
////            headers: {
////                'Content-Type': 'application/json',
////            },
////            body: JSON.stringify(formData),
////        });

////        onSave(); // callback function to refresh the list or close form
////    };

////    return (
////        <form onSubmit={handleSubmit}>
////            <label>Visitor:</label>
////           <select name="visitorId" value={formData.visitorId} onChange={handleChange} required>

////                <option value="">Select Visitor</option>
////                {visitors.map((visitor) => (
////                    <option key={visitor.visitorId} value={visitor.visitorId}>
////                        {visitor.Name}
////                    </option>
////                ))}
////            </select>

////            <label>Facility:</label>
////            <select name="facilityId" value={formData.facilityId} onChange={handleChange} required>
////                <option value="">Select Facility</option>
////                {facilities.map((facility) => (
////                    <option key={facility.facilityId} value={facility.facilityId}>
////                        {facility.Name}
////                    </option>
////                ))}
////            </select>

////            <label>Booking Date:</label>
////            <input type="date" name="bookingDate" value={formData.bookingDate} onChange={handleChange} required />

////            <label>Booking Time:</label>
////            <input type="time" name="bookingTime" value={formData.bookingTime} onChange={handleChange} required />

////            <label>Status:</label>
////            <select name="status" value={formData.status} onChange={handleChange} required>
////                <option value="Pending">Pending</option>
////                <option value="Confirmed">Confirmed</option>
////                <option value="Cancelled">Cancelled</option>
////            </select>

////            <button type="submit">{bookingId ? 'Update' : 'Create'} Booking</button>
////        </form>
////    );
////}

////export default CreateBooking;