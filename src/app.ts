import * as express from "express";
import * as logger from "morgan";

import * as cors from "cors";
import { orderRouter } from "./routes/order";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(logger("dev"));

app.use("/orders", orderRouter);
