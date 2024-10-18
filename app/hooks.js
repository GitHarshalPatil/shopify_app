import { useState, useEffect, useCallback } from "react";

// Custom hook to make authenticated fetch requests
export function useAuthenticatedFetch() {
    const [headers, setHeaders] = useState({});

    useEffect(() => {
        async function fetchSessionToken() {
            try {
                // Fetch the token from your API (customize the endpoint as per your setup)
                const response = await fetch("/api/auth/token");

                // If the response is not OK, handle the error
                if (!response.ok) {
                    throw new Error("Failed to fetch authentication token");
                }

                const data = await response.json();

                // Set the Authorization header with the fetched token
                setHeaders({ Authorization: `Bearer ${data.token}` });
            } catch (error) {
                console.error("Error fetching token:", error);
            }
        }

        fetchSessionToken();
    }, []);

    // Memoize the returned function to prevent unnecessary re-creations
    const authenticatedFetch = useCallback(
        async (url, options = {}) => {
            if (!headers.Authorization) {
                throw new Error("Authorization token is missing");
            }

            // Perform the fetch request with the merged headers
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...headers,
                    ...options.headers, // Merge any custom headers passed in options
                },
            });

            // Handle any non-OK responses (optional, based on your API needs)
            if (!response.ok) {
                throw new Error(`Fetch failed with status: ${response.status}`);
            }

            return response;
        },
        [headers] // Ensure this function gets updated when headers change
    );

    return authenticatedFetch;
}
