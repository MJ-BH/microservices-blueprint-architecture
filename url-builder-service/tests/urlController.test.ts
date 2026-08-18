import request from 'supertest';
import app from '../src/index';
import axios from 'axios';

// 1. Setup Mocks
jest.mock('axios');
const mockedAxios = jest.mocked(axios);

// ✅ HELPER: Creates a valid Axios Response object to satisfy TypeScript
const createAxiosResponse = (data: any, status = 200) => ({
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {} as any, // Cast to any to avoid mocking internal config details
});

describe('URL Builder Unit Tests', () => {

    // Reset mocks before every test
    beforeEach(() => {
        jest.resetAllMocks();
    });

    // 🟢 TEST 1: HAPPY PATH
    it('should calculate logic and return ApiResult', async () => {
        // 1. Prepare Auth Data (Success)
        // Matches structure expected by your UrlRepository
        const authData = { 
            code: 200, 
            status: 'success', 
            data: { email: 'alice@test.com' } 
        };
        
        //  Use the helper to wrap data
        mockedAxios.patch.mockResolvedValueOnce(createAxiosResponse(authData));
        
        // 2. Prepare Email Response (Success)
        mockedAxios.post.mockResolvedValueOnce(createAxiosResponse({ status: 'queued' }));

        // 3. Perform Request
        const res = await request(app).post('/buildUrl').send({
            name: 'Alice', timestamps: [10, 30, 20]
        });

        // Debug if failed
        if (res.statusCode !== 200) {
            console.error("🚨 Failed:", JSON.stringify(res.body, null, 2));
        }

        // 4. Assertions
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('success');
        
        // Check Data (Matching your UrlService return structure)
        expect(res.body.data.url).toContain('duration=0h0min20s');
        expect(res.body.data.email).toBe('alice@test.com');
        expect(res.body.data.emailStatus).toBe('Queued Successfully');
    });

    // 🟢 TEST 2: VALIDATION ERROR
    it('should handle validation errors', async () => {
        const res = await request(app).post('/buildUrl').send({
            name: 'Alice', timestamps: "invalid"
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe('error');
        expect(res.body.message).toContain('Invalid input');
    });

    // 🟢 TEST 3: AUTH SERVICE FAILURE
    it('should handle Auth Service failure (User Not Found)', async () => {
        // 1. Mock Error Response
        // We simulate a 404 error from Axios
        const axiosError = {
            response: createAxiosResponse({ message: 'User not found' }, 404),
            message: 'Request failed with status code 404',
            isAxiosError: true
        };

        //  Use the helper inside the error object too
        mockedAxios.patch.mockRejectedValueOnce(axiosError);

        // 2. Perform Request
        const res = await request(app).post('/buildUrl').send({
            name: 'Unknown', timestamps: [10, 20]
        });

        // 3. Assertions
        expect(res.statusCode).toBe(404);
        expect(res.body.status).toBe('error');
        // Your repository captures "User not found"
        expect(res.body.message).toContain('User not found');
    });
});