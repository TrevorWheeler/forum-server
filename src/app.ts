import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Controller from "./interfaces/Route";
import errorMiddleware from "./middleware/error.middleware";
import config, { ClientOrigins } from "./config";

class App {
  public app: express.Application;

  constructor(routes: Controller[]) {
    this.app = express();
    this.connectDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(helmet());
    this.app.use(morgan("tiny"));
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      cors({
        origin: config.clientOrigins[config.nodeEnv as keyof ClientOrigins],
        credentials: true,
      })
    );
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeRoutes(controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  private connectDatabase(): void {
    mongoose
      .connect(
        `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_PATH}/core`
      )
      .then(() => console.log("DB connected"));
  }

  public listen() {
    this.app.listen(config.port, () => {
      console.log(
        `Listening on ${config.port} with NODE_ENV=${config.nodeEnv}`
      );
    });
  }
  public getServer() {
    return this.app;
  }
}

export default App;
