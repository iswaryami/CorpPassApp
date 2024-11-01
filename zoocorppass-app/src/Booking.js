import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CreateBooking from './CreateBooking';
import BookingList from './BookingList';

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


            <Routes>
                <Route path="create" element={<CreateBooking />} />
                <Route path="view" element={<BookingList />} />
            </Routes>
        </div>
    );
};

export default Booking;