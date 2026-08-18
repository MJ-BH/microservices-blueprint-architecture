import { sendToQueue } from '../config/rabbitmq';

export class QueueRepository {
    
    async pushToEmailQueue(data: object): Promise<boolean> {
        try {
            return sendToQueue(data);
        } catch (error :  any ) {
            throw new Error('RabbitMQ Connection Failed');
        }
    }
}