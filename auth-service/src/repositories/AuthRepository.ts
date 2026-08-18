import User, { IUser } from '../models/User';

export class AuthRepository {
    
    // Find a user by Email
    async findByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email });
    }

    // Create a new user
    async create(userData: Partial<IUser>): Promise<IUser> {
        return await User.create(userData);
    }

    // Update URL (Atomic operation)
    async updateUrl(name: string, url: string): Promise<IUser | null> {
        return await User.findOneAndUpdate(
            { fullname: name },
            { generatedUrl: url },
            { new: true }
        );
    }
}