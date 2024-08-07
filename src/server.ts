import { config } from "dotenv";
import { connection } from "mongoose";
import { app } from "./app";
import { connectToMongoDb } from "./config/db";
import { OrderMessageConsumer } from "./messages/OrderMessage";

async function createServer() {
  config();
  await connectToMongoDb();

  const PORT = process.env.NODE_API_PORT;
  const server = app.listen(PORT, () => {
    console.log("App is running on port:", PORT);
  });

  const orderMessageChannel = new OrderMessageConsumer(server);
  await orderMessageChannel.consumeMessages();

  process.on("SIGNIT", () => {
    connection.close();
  });
}
createServer();
