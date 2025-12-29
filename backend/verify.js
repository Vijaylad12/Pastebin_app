const axios = require('axios');

const API_URL = 'http://127.0.0.1:3001/api';

async function testBackend() {
    try {
        console.log('Testing Health Check...');
        const health = await axios.get(`${API_URL}/healthz`);
        console.log('Health:', health.data);

        console.log('Creating Paste...');
        const createRes = await axios.post(`${API_URL}/pastes`, {
            content: 'Verification Content',
            ttl_seconds: 60
        });
        console.log('Created:', createRes.data);
        const { id } = createRes.data;

        console.log(`Fetching Paste ${id}...`);
        const getRes = await axios.get(`${API_URL}/pastes/${id}`);
        console.log('Fetched:', getRes.data);

        if (getRes.data.content === 'Verification Content') {
            console.log('SUCCESS: Content matches!');
        } else {
            console.error('FAILURE: Content mismatch');
            process.exit(1);
        }

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

testBackend();
