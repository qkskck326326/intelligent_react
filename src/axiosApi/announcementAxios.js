export default class AnnouncementAxios {

    constructor() {
        this.baseURL = 'http://localhost:8080';
    }

    async get(URL, queryString = '') {
        try {
            const response = await fetch(`${this.baseURL}${URL}${queryString}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('GET ERROR:', error);
            throw error;
        }
    }

    async post(URL, object) {
        try {
            const response = await fetch(`${this.baseURL}${URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(object)
            });
            if (!response.ok) {
                throw new Error(`status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('POST ERROR:', error);
            throw error;
        }
    }

    async put(URL, object) {
        try {
            const response = await fetch(`${this.baseURL}${URL}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(object)
            });
            if (!response.ok) {
                throw new Error(`status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('PUT ERROR:', error);
            throw error;
        }
    }

    async delete(URL, object) {
        try {
            const response = await fetch(`${this.baseURL}${URL}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(object)
            });
            if (!response.ok) {
                throw new Error(`status: ${response.status}`);
            }

        } catch (error) {
            console.error('DELETE ERROR:', error);
            throw error;
        }
    }
}
