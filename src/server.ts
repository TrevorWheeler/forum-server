import "dotenv/config";
import App from "./app";
import AuthenticationRoute from "./routes/auth";
import PostRoute from "./routes/post";
import validateEnv from "./utils/validateEnv";

validateEnv();
const app = new App([new AuthenticationRoute(), new PostRoute()]);
app.listen();
