import { QueueRepository } from '../repositories/QueueRepository';

export class EmailService {
    private queueRepository: QueueRepository;       

    constructor() {
        this.queueRepository = new QueueRepository();
    }

    async enqueueEmail(email: string, name: string, url: string){
      if (!email || !name || !url) {
            throw new Error('Missing required fields');
        }

        const success = await this.queueRepository.pushToEmailQueue({ email, name, url });
        
        if (!success) {
            throw new Error('Queue service unavailable');
        }

        return { status: 'Processing', queuedAt: new Date() };
    }
    
}