import React, { useEffect, useState } from 'react';
import { fetchUserData } from '../api';

const UserData = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchUserData();
                setUserData(data);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                setError(error.message || "Failed to load data");
            }
        };

        loadData();
    }, []);

    if (error) return <div>Error: {error}</div>;
    if (!userData) return <div>Loading...</div>;

    return (
        <div>
            <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
    );
};


export default UserData;