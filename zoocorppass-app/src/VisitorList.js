import React, { useState } from 'react';
import axios from 'axios';

function VisitorsList() {
    const [visitors, setVisitors] = useState([]); 
    const [visitor, setVisitor] = useState(null);  
    const [error, setError] = useState(null);
    const [visitorId, setVisitorId] = useState('');

    // Fetch all visitors
    const fetchAllVisitors = async () => {
        try {
            const response = await axios.get("https://localhost:7082/api/visitor");
            setVisitors(response.data);
            setVisitor(null); 
        } catch (error) {
            setError(error.message);
        }
    };

    // Fetch a single visitor by ID
    const fetchVisitorById = async (id) => {
        try {
            const response = await axios.get(`https://localhost:7082/api/visitor/${id}`);
            setVisitor(response.data);
            setVisitors([]); 
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h2>Visitors</h2>
            <div>
                <button onClick={fetchAllVisitors}>Get All Visitors</button>
                <input
                    type="text"
                    value={visitorId}
                    onChange={(e) => setVisitorId(e.target.value)}
                    placeholder="Enter Visitor ID"
                />
                <button onClick={() => fetchVisitorById(visitorId)}>Get Visitor by ID</button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {visitors.length > 0 && (
                <ul>
                    {visitors.map(visitor => (
                        <li key={visitor.visitorId}>{visitor.name}</li>
                    ))}
                </ul>
            )}

            {visitor && (
                <div>
                    <h3>Visitor Details</h3>
                    <p><strong>ID:</strong> {visitor.visitorId}</p>
                    <p><strong>Name:</strong> {visitor.name}</p>
                    <p><strong>Email:</strong> {visitor.email}</p>
                    <p><strong>Phone Number:</strong> {visitor.phoneNumber}</p>
                    <p><strong>Address:</strong> {visitor.address}</p>
                </div>
            )}
        </div>
    );
}

export default VisitorsList;
