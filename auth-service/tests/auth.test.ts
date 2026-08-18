import request from 'supertest';
import app from '../src/index';
import User from '../src/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// --- MOCKS ---
jest.mock('../src/models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Service Unit Tests (Clean Architecture)', () => {
    
    // --- REGISTER ---
    it('POST /register - should create user and return wrapped ApiResult', async () => {
        // Mock Repository/Mongoose calls
        (User.findOne as jest.Mock).mockResolvedValue(null);
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_pw');
        (User.create as jest.Mock).mockResolvedValue({ 
            _id: '123', 
            email: 'test@test.com',
            toObject: () => ({ _id: '123' }) 
        });
        (jwt.sign as jest.Mock).mockReturnValue('test_token');

        const res = await request(app).post('/register').send({
            fullname: 'John Doe', email: 'test@test.com', password: '123'
        });

        // Check HTTP Status
        expect(res.statusCode).toBe(201);
        
        // Check Generic Wrapper Structure
        expect(res.body.status).toBe('success');
        expect(res.body.code).toBe(201);
        expect(res.body.message).toBe('User registered successfully');
        
        // Check Data
        expect(res.body.data).toHaveProperty('token', 'test_token');
    });

    it('POST /register - should fail gracefully if email exists', async () => {
        // Mock User Found
        (User.findOne as jest.Mock).mockResolvedValue({ email: 'test@test.com' });

        const res = await request(app).post('/register').send({
            fullname: 'John', email: 'test@test.com', password: '123'
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe('error');
        expect(res.body.message).toBe('Email already exists');
    });

    // --- LOGIN ---
    it('POST /login - should return token on success', async () => {
        const mockUser = { 
            _id: '123', 
            email: 'test@test.com', 
            password: 'hashed_pw' 
        };
        
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (jwt.sign as jest.Mock).mockReturnValue('test_token');

        const res = await request(app).post('/login').send({
            email: 'test@test.com', password: '123'
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('token', 'test_token');
    });
});