import { connect } from "mongoose";
import { config } from "dotenv";

config();

const USER = process.env.MONGO_INITDB_ROOT_USERNAME;
const PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD;
const PORT = process.env.MONGO_INITDB_ROOT_HOST;
const HOST = process.env.MONGO_INITDB_ROOT_PORT;

const URI = `mongodb://${USER}:${PASSWORD}@${PORT}:${HOST}`;

export const connectToMongoDb = async () => {
  try {
    await connect(URI, {
      dbName: process.env.MONGO_INITDB_ROOT_DB_NAME,
    });
    console.log("App conected with MongoDB");
  } catch (error) {
    if (error instanceof Error) {
      console.error("ERROR - could not connect to MongoDB: ", error.message);
    }
  }
};
