import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { userRoute } from "../server/routes/userRoute.js";
import { residencyRoute } from "../server/routes/residencyRoute.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://homyz-mu.vercel.app", // allow your frontend domain
    credentials: true, // optional, if you're using cookies or Auth0
  })
);

app.use("/api/user", userRoute);
app.use("/api/residency", residencyRoute);

app.listen(port, () => {
  console.log(`port ${port}`);
});
