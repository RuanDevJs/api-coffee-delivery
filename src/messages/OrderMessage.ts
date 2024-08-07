import { Channel, connect } from "amqplib";
import { config } from "dotenv";
import { Server } from "socket.io";
import * as http from "http";

config();

const AMQP_SERVER_PORT = process.env.AMQP_SERVER_PORT;
const AMQP_USER = process.env.AMQP_USER;
const AMQP_PASS = process.env.AMQP_PASS;

const URI = `amqp://${AMQP_USER}:${AMQP_PASS}@localhost:${AMQP_SERVER_PORT}`;

export class OrderMessageChannel {
  private _channel: Channel;

  private async createChannel() {
    try {
      const connection = await connect(URI);
      this._channel = await connection.createChannel();
      await this._channel.assertQueue(process.env.AMQP_QUEUE_NAME, {
        durable: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error: Could not create channel - " + error.message);
      }
    }
  }

  private async validateChannel() {
    if (!this._channel) await this.createChannel();
  }

  public async sendMessageToQueue() {
    await this.validateChannel();
    this._channel.sendToQueue(
      process.env.AMQP_QUEUE_NAME,
      Buffer.from("New order created")
    );
  }
}

export class OrderMessageConsumer {
  private _channel: Channel;
  private _io: Server;

  constructor(server: http.Server) {
    this._io = new Server(server, {
      cors: {
        origin: process.env.NODE_SOCKET_CLIENT_SERVER,
        methods: ["GET", "POST"],
      },
    });

    this._io.on("connection", (socket) => {
      console.log("Web socket connection created");
      socket.emit("connected", "You are connected to the WebSocket server");
    });
  }

  private async _createMessageChannel() {
    try {
      const connection = await connect(URI);
      this._channel = await connection.createChannel();
      await this._channel.assertQueue(process.env.AMQP_QUEUE_NAME);
    } catch (error) {
      console.log("Connection to RabbitMQ failed");
      console.log(error);
    }
  }

  async consumeMessages() {
    try {
      await this._createMessageChannel();

      if (this._channel) {
        console.log("Started consuming messages");
        console.log("SOCKET NAME", process.env.AMQP_QUEUE_NAME);
        await this._channel.consume(
          process.env.AMQP_QUEUE_NAME,
          async (logMsg) => {
            this._channel.ack(logMsg);

            this._io.emit(process.env.AMQP_QUEUE_NAME, "New order was created");

            console.log("New Log emitted by web socket");
          }
        );
      }
    } catch (error) {
      if (error instanceof Error)
        console.error("Error on consume message: ", error.message);
      throw new Error("Error on consume message: " + error.message);
    }
  }
}
