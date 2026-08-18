import axios from "axios";

const AUTH_MS_URL = process.env.AUTH_SERVICE_URL || "http://auth-service:3001";
const EMAIL_MS_URL =
  process.env.EMAIL_SERVICE_URL || "http://email-service:3003";
export class UrlRepository {
  async updateUserUrl(name: string, generatedUrl: string): Promise<string> {
    try {
      const authResponse = await axios.patch(
        `${AUTH_MS_URL}/internal/update-url`,
        {
          name: name,
          url: generatedUrl,
        }
      );

      // Handle wrapped response { data: { email: "..." } } vs raw { email: "..." }
      const responseData = authResponse.data as any;

      if (responseData.data && responseData.data.email) {
        return responseData.data.email;
      }

      return responseData.email;
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;

      throw new Error(`Auth Service Error: ${msg}`);
    }
  }

  async sendEmailRequest(email: string, name: string, url: string): Promise<void> {
        try {
            await axios.post(`${EMAIL_MS_URL}/send`, {
                email,
                name,
                url
            });
        } catch (error: any) {
            throw new Error(`Email Service Error: ${error.message}`);
        }
    }
}
