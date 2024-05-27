import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';
const OPEN_LIBRARY_URL = 'http://openlibrary.org/search.json?title=';

const getAuthToken = () => localStorage.getItem('token');

const customAPI = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

customAPI.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const searchBooks = async (term, page) => {
    try {
        const response = await fetch(`${OPEN_LIBRARY_URL}${term}&page=${page}`);
        const data = await response.json();
        return data.docs.slice(0, 20).map(book => ({
            id: book.key,
            author: book.author_name,
            cover_id: book.cover_i,
            edition_count: book.edition_count,
            first_publish_year: book.first_publish_year,
            title: book.title
        }));
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};

export const fetchUserData = async () => {
    try {
        const response = await customAPI.get('/user-data');
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Failed to fetch data: ' + response.status);
        }
    } catch (error) {
        console.error('API call error: ', error.message);
        throw error;
    }
};

export default {
    searchBooks,
    fetchUserData
};
