import { Router } from "express";
import { Coffee, Order } from "../models";
import OrderRepositories from "../repositories/OrderRepositories";

export const orderRouter = Router();
export const orderRepositories = new OrderRepositories();

orderRouter.post("/", async (request, response) => {
  try {
    const payload = request.body as Order;
    const savedOrder = await orderRepositories.save(payload);

    if (savedOrder && savedOrder._id) {
      return response.status(201).json({ newOrder: savedOrder.toJSON() });
    }

    return response.status(500).json({ message: "Could not POST on Database" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error on route /order -> POST", error.message);
      return response.status(500).json({ error: error.message });
    }
  }
});

orderRouter.get("/", async (request, response) => {
  try {
    const payload = request.body as Order;
    const allOrdersInDB = await orderRepositories.find();

    if (allOrdersInDB && allOrdersInDB.length) {
      return response.status(200).json({ orders: allOrdersInDB });
    }

    return response.status(500).json({ message: "Could not POST on Database" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error on route /order -> POST", error.message);
      return response.status(500).json({ error: error.message });
    }
  }
});
