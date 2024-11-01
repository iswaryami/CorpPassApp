import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FacilitiesList() {

    const [facilities, setFacilities] = useState([]); 
    const [facility, setFacility] = useState(null);   
    const [error, setError] = useState(null);
    const [facilityId, setFacilityId] = useState('');

    // Fetch all facilities
    const fetchAllFacilities = async () => {
        try {
            const response = await fetch("https://localhost:7082/api/facilities");
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

            const data = await response.json();
            setFacilities(data);
            setFacility(null); 
        } catch (error) {
            setError(error.message);
        }
    };

    // Fetch a single facility by ID
    const fetchFacilityById = async (id) => {
        try {
            const response = await fetch(`https://localhost:7082/api/facilities/${id}`);
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

            const data = await response.json();
            setFacility(data);
            setFacilities([]); 
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h2>Facilities</h2>
            <div>
                <button onClick={fetchAllFacilities}>Get All Facilities</button>
                <input
                    type="text"
                    value={facilityId}
                    onChange={(e) => setFacilityId(e.target.value)} 
                    placeholder="Enter Facility ID"
                />
                <button onClick={() => fetchFacilityById(facilityId)}>Get Facility by ID</button> 
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {facilities.length > 0 && (
                <ul>
                    {facilities.map(facility => (
                        <li key={facility.id}>{facility.name}</li> 

                    ))}
                </ul>
            )}

            {facility && (
                <div>
                    <h3>Facility Details</h3>
                    <p><strong>ID:</strong> {facility.facilityId}</p>
                    <p><strong>Name:</strong> {facility.name}</p>
                    <p><strong>Location:</strong> {facility.location}</p>
                    <p><strong>Type:</strong> {facility.type}</p>
                    <p><strong>Amenities:</strong> {facility.amenities}</p>
                    <p><strong>Capacity:</strong> {facility.capacity}</p>
                </div>
            )}
        </div>
    );
}

export default FacilitiesList;


