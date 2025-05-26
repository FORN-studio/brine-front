import { PUBLIC_API_URL } from '$env/static/public';

export const search = async (query, limit = 5) => {
    const response = await fetch(`${PUBLIC_API_URL}/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, limit })
    });

    const data = await response.json();

    return data;
}

export const similar = async (companyId, limit = 5) => {
    const response = await fetch(`${PUBLIC_API_URL}/similar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ company_id: companyId, limit })
    });

    const data = await response.json();

    return data;
}

export const getRandomId = async () => {
    const randomIndex = Math.floor(Math.random() * 8000)
    const response = await fetch(`${PUBLIC_API_URL}/company/${randomIndex}`);

    const res = await response.json();
    const result = await similar(res.company_id);

    return result;
}

