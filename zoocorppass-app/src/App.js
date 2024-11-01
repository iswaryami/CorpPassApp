import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './HomePage';
import FacilitiesList from './FacilitiesList';
import Booking from './Booking.js';
import Visitors from './Visitors.js';

function App() {
    return (
        <Router>
            <div>
                <h1>Welcome to Zoo Corp</h1>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/facilities">Facilities</Link>
                        </li>
                        <li>
                            <Link to="/booking">Booking</Link>
                        </li>
                        <li>
                            <Link to="/visitors">Visitors</Link>
                        </li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/facilities" element={<FacilitiesList />} />
                    <Route path="/Booking/*" element={<Booking />} />
                    <Route path="/Visitors/*" element={<Visitors />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
