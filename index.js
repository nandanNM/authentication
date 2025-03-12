import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.js";
import userRouter from "./routers/user.router.js";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();
const port = process.env.PORT || 4000;
const corsOptions = {
  origin: "http://127.0.0.1:3000",
  methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
  credentials: true,
};
//Express.js middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);
await connectDB();
app.get("/", (req, res) => {
  res.send("Hello Nandan!");
  // console.log(req);
});
app.use("/api/v1/users", userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
