import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import dotenv from "dotenv";
import { connectRabbitMQ } from "./config/rabbitmq";
import startWorker from "./workers/emailWorker";
import emailRoutes from "./routes/emailRoutes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(express.json());
app.use(cors());

// Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Email Service API", version: "1.0.0" },
    servers: [
      // Point to the Gateway URL for Email
      { url: "http://localhost:3000/api/v1/email", description: "API Gateway" },
    ],
  },
  apis: ["./src/routes/*.ts", "./dist/routes/*.js"], // Support TS and JS (dist)
};
const specs = swaggerJsDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.get("/swagger.json", (req: Request, res: Response) => {
  res.json(specs);
});
app.use('/', emailRoutes);

// Error Handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

//  Only start server/worker if NOT in test mode
if (process.env.NODE_ENV !== 'test') {
    const startServer = async () => {
        await connectRabbitMQ();
        startWorker();

        app.listen(PORT, () => {
            console.log(`🚀 Email Service running on port ${PORT}`);
        });
    };
    startServer();
  }

export default app;
