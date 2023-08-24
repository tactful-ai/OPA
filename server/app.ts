// Import required modules
import bodyParser from "body-parser";
import express from "express";
import retrieveRoutes from "./routes/retrieve";
import editRouter from "./routes/edit";
import gitManager from "./services/gitManger";

import { setupSwagger } from "./services/swagger";
require("dotenv").config();

// Create an Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

app.use(retrieveRoutes);
app.use(editRouter);
// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
);

// Setup swagger
setupSwagger(app);
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  gitManager.init();
});
