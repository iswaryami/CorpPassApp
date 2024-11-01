
import React, { useState } from 'react';

const CreateVisitor = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // To show validation messages

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input
        if (!name || !email || !phoneNumber) {
            setErrorMessage('Name, email, and phone number are required.');
            return;
        }

        // Create visitor object
        const visitor = {
            name,
            email,
            phoneNumber,
            address,
        };

        try {
            const response = await fetch('https://localhost:7082/api/visitor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(visitor),
            });

            if (response.ok) {
                // Handle successful creation (e.g., show a success message or clear the form)
                console.log('Visitor created successfully');
                // Optionally reset the form fields
                setName('');
                setEmail('');
                setPhoneNumber('');
                setAddress('');
                setErrorMessage('');
            } else {
                throw new Error('Failed to create visitor');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Error creating visitor. Please try again later.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="phoneNumber">Phone Number:</label>
                <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="address">Address:</label>
                <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </div>

            <button type="submit">Create Visitor</button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
    );
};

export default CreateVisitor;
