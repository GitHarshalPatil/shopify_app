import { useState, useEffect, useCallback } from "react";

// Custom hook to make authenticated fetch requests
export function useAuthenticatedFetch() {
    const [headers, setHeaders] = useState({});

    async function fetchAccessToken() {
        try {
            // Call your backend API to get the access token
            const response = await fetch("https://shopy-appstore.myshopify.com/admin/api/2024-10"); // Update this to your actual endpoint

            if (!response.ok) {
                throw new Error("Failed to fetch access token");
            }

            const data = await response.json();

            // Assuming the token is returned in data.token
            setHeaders({ Authorization: `Bearer ${data.token}` });
        } catch (error) {
            console.error("Error fetching token:", error);
        }
    }
    useEffect(() => {
        fetchAccessToken();
    }, []);

    const authenticatedFetch = useCallback(
        async (url, options = {}) => {
            if (!headers.Authorization) {
                throw new Error("Authorization token is missing");
            }

            const response = await fetch(url, {
                ...options,
                headers: {
                    ...headers,
                    ...options.headers,
                },
            });

            if (!response.ok) {
                throw new Error(`Fetch failed with status: ${response.status}`);
            }

            // Optionally return the parsed JSON response
            return response.json(); // This line returns the JSON response
        },
        [headers] // Consider the implications of this dependency
    );

    return authenticatedFetch;
}
