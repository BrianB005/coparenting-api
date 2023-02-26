require("dotenv").config();
require("express-async-errors");
// express

const express = require("express");
const app = express();
// rest of the packages
const morgan = require("morgan");

const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

// connecting database
const connectDB = require("./db/connect");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const authRouter = require("./routes/auth");
const messagesRouter = require("./routes/messageRoutes");
const galleryRouter = require("./routes/galleryRoutes");
const userRouter = require("./routes/userRoutes");
const eventsRouter = require("./routes/eventRoutes");
const expensesRouter = require("./routes/expenseRoutes");
const emailRouter = require("./routes/emailRoutes");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/messages", messagesRouter);
app.use("/api/v1/gallery", galleryRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/events", eventsRouter);
app.use("/api/v1/expenses", expensesRouter);
app.use("/api/v1/emails", emailRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port} ...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
