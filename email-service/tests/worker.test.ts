import startWorker from '../src/workers/emailWorker';
import { getChannel } from '../src/config/rabbitmq';

// Mocks
const mockChannel = { consume: jest.fn(), ack: jest.fn(), sendToQueue: jest.fn() };
const mockTransporter = { sendMail: jest.fn() };

// Mock Imports
jest.mock('../src/config/rabbitmq', () => ({
    getChannel: jest.fn(() => mockChannel),
    QUEUE_NAME: 'test_queue'
}));

jest.mock('../src/config/transporter', () => jest.fn(() => mockTransporter));
jest.mock('nodemailer');

describe('Email Worker Logic Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        startWorker(); // Initialize the worker (attaches consume listener)
    });

    // Helper to simulate an incoming RabbitMQ message
    const simulateMessage = async (payload: object) => {
        const consumeCallback = (mockChannel.consume as jest.Mock).mock.calls[0][1];
        await consumeCallback({ content: Buffer.from(JSON.stringify(payload)) });
    };

    it('should ACK message on success', async () => {
        (mockTransporter.sendMail as jest.Mock).mockResolvedValue({ messageId: '1' });
        
        await simulateMessage({ email: 'ok@test.com', name: 'Test', url: 'u' });
        
        expect(mockChannel.ack).toHaveBeenCalled();
        expect(mockChannel.sendToQueue).not.toHaveBeenCalled();
    });

    it('should REQUEUE if retries < 3', async () => {
        (mockTransporter.sendMail as jest.Mock).mockRejectedValue(new Error('SMTP Error'));
        
        // Send message with 0 retries
        await simulateMessage({ email: 'fail@test.com', retryCount: 0 });
        
        // Expect Requeue
        expect(mockChannel.sendToQueue).toHaveBeenCalled();
        // Expect ACK (removing old message)
        expect(mockChannel.ack).toHaveBeenCalled();
    });

    it('should DROP message if retries >= 3', async () => {
        (mockTransporter.sendMail as jest.Mock).mockRejectedValue(new Error('SMTP Error'));
        
        await simulateMessage({ email: 'fail@test.com', retryCount: 3 });
        
        // Expect ACK (Drop) but NO Requeue
        expect(mockChannel.ack).toHaveBeenCalled();
        expect(mockChannel.sendToQueue).not.toHaveBeenCalled();
    });
});