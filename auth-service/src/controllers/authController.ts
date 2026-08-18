import { Request, Response } from 'express';
import { AuthService} from '../services/AuthService';
import { ApiResult } from '../utils/ApiResult';


const authService = new AuthService();
// Register
export const register = async (req : Request, res : Response) => {
    try {
        const result = await authService.register(req.body.fullname, req.body.email, req.body.password);
        const apiResult = ApiResult.created(result, 'User registered successfully');
        return res.status(apiResult.code as number ).json(apiResult);
     
    } catch (error) {
        const message = (error as Error).message;
        const code = message === 'Email already exists' || message === 'All fields are required' || message === 'Invalid email format. Example: user@domain.com'  ? 400 : 500;
        const apiResult = ApiResult.error(message, code);
        return res.status(apiResult.code as number).json(apiResult);
      
    }
};

// Login
export const  login = async (req : Request, res : Response) => {
    try {
        const result = await authService.login(req.body.email, req.body.password);
        const apiResult = ApiResult.success(result, 'Login successful');
        return res.status(apiResult.code as number).json(apiResult);
    } catch (error) {
        const message = (error as Error).message;
        const code = message === 'Invalid credentials' ? 400 : 500;
        const apiResult = ApiResult.error(message, code);
        return res.status(apiResult.code as number).json(apiResult);
    }
};

// Internal Endpoint for Microservice Communication
export const updateUserUrl = async (req : Request, res : Response) => {
    try {
        const result = await authService.updateUrl(req.body.name, req.body.url);
        const apiResult = ApiResult.success(result, 'URL updated successfully');
        return res.status(apiResult.code as number).json(apiResult);
     
    } catch (error) {
        const message = (error as Error).message;       
        const code = message === 'User not found' ? 404 : 500;
        const apiResult = ApiResult.error(message, code);
        return res.status(apiResult.code as number).json(apiResult);
    }
};