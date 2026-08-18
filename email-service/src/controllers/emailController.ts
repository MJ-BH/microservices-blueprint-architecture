import { Request, Response } from "express";
import { EmailService } from "../services/EmailService";
import { ApiResult } from "../utils/ApiResult";

const emailService = new EmailService();

export const sendEmail = async (req: Request, res: Response) => {
  try {
    const { email, name, url } = req.body;

    if (!email || !name || !url) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await emailService.enqueueEmail(email, name, url);

    const response = ApiResult.success(
      result,
      "Email request queued successfully"
    );
    response.code = 202; // Semantic correctness

    res.status(202).json(response);
  } catch (error: any) {
    console.error("Error in sendEmail controller:", error);
    const message = error.message || "Internal Server Error";
    let code = 500;
    if (message.includes("Missing required fields")) code = 400;
    if (
      message.includes("Queue service unavailable") ||
      message.includes("RabbitMQ")
    ) {
      code = 503;
    }
    const response = ApiResult.error(message, code);

    res.status(code).json(response);
  }
};
