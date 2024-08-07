import { Document, model, ObjectId, Schema, Types } from "mongoose";

export interface Coffee {
  category: string[];
  description: string;
  img: string;
  name: string;
  price: number;
  quantity: number;
  _id: string;
}

export interface Order extends Document {
  address: {
    cep: string;
    city: string;
    complement: string;
    neighborhood: string;
    number: number;
    street: string;
    uf: string;
  };
  coffees: Coffee[];
  payment_method: string;
}

const schema = new Schema<Order>({
  address: {
    cep: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    complement: {
      type: String,
      required: true,
    },
    neighborhood: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    uf: {
      type: String,
      required: true,
    },
  },
  coffees: [
    {
      category: {
        type: [String],
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      _id: {
        type: String,
        required: true,
      },
    },
  ],
  payment_method: {
    type: String,
    required: true,
  },
});

export const OrderModel = model<Order>("Order", schema);
