import { OrderMessageChannel } from "../messages/OrderMessage";
import { Order, OrderModel } from "../models";

const orderMessageChannel = new OrderMessageChannel();

export default class OrderRepositories {
  public async find(): Promise<Order[]> {
    const allOrdersInDB = await OrderModel.find().sort({ _id: -1 });
    return allOrdersInDB;
  }

  public async findById(orderId: string): Promise<Order> {
    const orderFoundById = await OrderModel.findById(orderId);
    return orderFoundById;
  }

  public async save(order: Order): Promise<Order> {
    const savedOrder = await OrderModel.create(order);
    await orderMessageChannel.sendMessageToQueue();
    return savedOrder;
  }
}
