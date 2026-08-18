import { AuthRepository } from "../repositories/AuthRepository";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { emit } from "process";


export class AuthService {
    private authRepository: AuthRepository;   
 constructor() {
        this.authRepository = new AuthRepository();
    }
    // Helper for JWT
    private  generateToken = (id: string): string => {
        return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    };
    private validateEmail = (email : string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };
    
   async register(fullname: string, email: string, password: string) {
        // Validation
        if (!fullname || !email || !password) {
            throw new Error('All fields are required');
        }
         if (!this.validateEmail(email)) {
            throw new Error('Invalid email format. Example: user@domain.com')
        }   
        const existingUser = await this.authRepository.findByEmail(email);
        if (existingUser) throw new Error('Email already exists');  
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.authRepository.create({ fullname, email, password: hashedPassword });      
        return {
            message: 'User registered successfully',
            token: this.generateToken(user.id)
        };
    }
    async login (email: string, password: string) {
        const user =  await this.authRepository.findByEmail(email); 
        if (!user || !(await bcrypt.compare(password, user.password as string ))) {
            throw new Error('Invalid credentials');
        }       
        return { 
            message: 'Login successful',
            token: this.generateToken(user.id) 
        };  
         
    }

    async updateUrl(name: string, url: string) {
        const updatedUser = await this.authRepository.updateUrl(name, url);    
        if (!updatedUser) {
            throw new Error('User not found');
                            }
        return {
            message: 'URL updated successfully',
            email: updatedUser.email , 
            fullname : updatedUser.fullname
        }};
    
    } 