export async function fetchRugbyData(requestType, additionalParams = {}, ignore = 0) {
    try {
        const response = await fetch('https://bor-tools.onrender.com/proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ requestType, additionalParams })
        });

        const data = await response.json();

        // Check if the response contains valid data
        if (data?.status?.trim?.() === 'Ok') {
            return data;
        } else {
            console.error('API error', data);
        }
    } catch (error) {
        if (ignore != 0) {
            console.error('Error fetching rugby data', error);
        }
    }
}