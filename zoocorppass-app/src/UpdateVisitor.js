import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateVisitor = ({ visitorId }) => {
    const [visitor, setVisitor] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
    });
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchVisitor = async () => {
            try {
                const response = await axios.get(`https://localhost:7082/api/visitor/${visitorId}`);
                setVisitor(response.data);
            } catch (error) {
                setError('Error fetching visitor data');
            }
        };
        fetchVisitor();
    }, [visitorId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVisitor((prevVisitor) => ({
            ...prevVisitor,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://localhost:7082/api/visitor/${visitorId}`, visitor);
            alert('Visitor updated successfully!');
        } catch (error) {
            setError('Error updating visitor');
        }
    };

    return (
        <div>
            <h2>Update Visitor</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={visitor.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={visitor.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={visitor.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={visitor.address || ''}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Update Visitor</button>
            </form>
        </div>
    );
};

export default UpdateVisitor;
