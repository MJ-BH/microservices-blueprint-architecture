import request from 'supertest';
import app from '../src/index';
import { sendToQueue } from '../src/config/rabbitmq';

// Mock RabbitMQ Config (prevent connection)
jest.mock('../src/config/rabbitmq', () => ({
    connectRabbitMQ: jest.fn(),
    sendToQueue: jest.fn(),
    getChannel: jest.fn(),
    QUEUE_NAME: 'test_queue'
}));

// Mock Worker (prevent startup)
jest.mock('../src/workers/emailWorker', () => jest.fn());

describe('Email API Tests', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('POST /send - should push to queue and return 202', async () => {
        // Mock Success
        (sendToQueue as jest.Mock).mockReturnValue(true);

        const res = await request(app).post('/send').send({
            email: 'test@test.com', name: 'Test', url: 'http://url'
        });

        expect(res.statusCode).toBe(202);
        // Check generic wrapper
        expect(res.body.status).toBe('success');
        expect(res.body.data.status).toBe('Processing');
    });

    it('POST /send - should return 503 if Queue fails', async () => {
        // Mock Failure
        (sendToQueue as jest.Mock).mockImplementation(() => { 
            throw new Error('RabbitMQ Connection Failed'); 
        });

        const res = await request(app).post('/send').send({
            email: 't@t.com', name: 'T', url: 'u'
        });

        expect(res.statusCode).toBe(503);
        expect(res.body.status).toBe('error');
        expect(res.body.message).toContain('RabbitMQ');
    });
});