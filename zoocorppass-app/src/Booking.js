import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CreateBooking from './CreateBooking';
import BookingList from './BookingList';
// Component for creating a booking
//import ViewBooking from './ViewBooking';     // Component for viewing a booking

const Booking = () => {
    return (
        <div>
            <h2>Booking Page</h2>
            <nav>
                <ul>
                    <li>
                        <Link to="create">Create Booking</Link>
                    </li>
                    <li>
                       <Link to="view">View Booking</Link>
                    </li>
                </ul>
            </nav>

            {/* Define nested routes for booking operations */}
            <Routes>
                <Route path="create" element={<CreateBooking />} />
                <Route path="view" element={<BookingList />} />
                {/*<Route path="view" element={<ViewBooking />} />*/}
                {/* You can add more routes for viewing by ID, updating, etc. */}
            </Routes>
        </div>
    );
};

export default Booking;