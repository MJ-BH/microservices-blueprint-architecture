import { Request, Response } from "express";
import { UrlService } from "../services/UrlService";
import { ApiResult } from "../utils/ApiResult";

const urlService = new UrlService();
export const buildUrl = async (req: Request, res: Response) => {
  try {
    const { name, timestamps } = req.body;

    if (!name || !Array.isArray(timestamps)) {
      return res
        .status(400)
        .json(
          ApiResult.error("Invalid input: name and timestamps are required")
        );
    }

    const result = await urlService.buildUrl(name, timestamps);

    const response = ApiResult.success(
      result,
      "URL built and email processed successfully"
    );
    res.status(200).json(response);
  } catch (error: any) {
    console.error(error);
    const code = error.message.includes("not found") ? 404 : 500;
    const response = ApiResult.error(error.message, code);
    res.status(code).json(response);
  }
};
