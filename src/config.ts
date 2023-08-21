import dotenv from "dotenv";
dotenv.config();
import packageJson from "../package.json";
interface EnvConfig {
  name: string;
  description: string;
  nodeEnv: string;
  port: number | string;
  clientOrigins: ClientOrigins;
  secret: string;
}
export interface ClientOrigins {
  development: string;
  production: string;
}
const config: EnvConfig = {
  name: packageJson.name,
  description: packageJson.description,
  nodeEnv: process.env["NODE_ENV"] ?? "development",
  port: process.env["PORT"] ?? 3000,
  clientOrigins: {
    development: process.env["DEV_ORIGIN"] ?? "*",
    production: process.env["PROD_ORIGIN"] ?? "none",
  },
  secret: process.env.SECRET,
};

export default config;
