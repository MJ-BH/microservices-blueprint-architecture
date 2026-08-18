import { UrlRepository } from "../repositories/UrlRepository";


export class UrlService {
    private urlRepository: UrlRepository;       

    constructor() {
        this.urlRepository = new UrlRepository();
    }


    // Helpers
    private formatDuration = (seconds: number): string => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h${m}min${s}s`;
    };
    
    private calculateMedian = (arr: number[]): number => {
        if (arr.length === 0) return 0;
        arr.sort((a, b) => a - b);
        const mid = Math.floor(arr.length / 2);
        if (arr.length % 2 !== 0) return arr[mid];
        return Math.floor((arr[mid - 1] + arr[mid]) / 2);
    };
    

    async buildUrl(name: string, timestamps: any[]) {
    
       // 1. Validate & Filter Timestamps
        const validTimestamps: number[] = timestamps
            .filter((t: any) => Number.isInteger(t) && t > 0);

        if (validTimestamps.length === 0) {
            throw new Error('No valid timestamps provided');
        }

        // 2. Calculate Math
        validTimestamps.sort((a, b) => a - b);
        const oldest = validTimestamps[0];
        const newest = validTimestamps[validTimestamps.length - 1];
        
        const durationTotal = newest - oldest;
        const durationMedian = this.calculateMedian(validTimestamps) - oldest;

        const generatedUrl = `https://server/record?name=${name}&duration=${this.formatDuration(durationTotal)}&median=${this.formatDuration(durationMedian)}`;
    
       // updateDB and find email

       const userEmail = await this.urlRepository.updateUserUrl(name, generatedUrl);


       // send email
       let emailStatus = "Queued Successfully";

       try {
        await this.urlRepository.sendEmailRequest(userEmail, name, generatedUrl);
       } catch (error: any) {
        console.error("Error sending email:", error);
        emailStatus = `Failed to send email: ${error.message}`;
       }    
     // return final response
       return {
        url: generatedUrl,
        email: userEmail,
        emailStatus: emailStatus
       };
    
    }



}  