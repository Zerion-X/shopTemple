import type Order from "../Entities/Order";
import type { AdminOrder, CreateOrderResponse, OrderDetails, OrderStatus } from "../Entities/Order";
import { axiosInstance } from "./api-client";

export const createOrder = async (
  shipping_address: string
): Promise<CreateOrderResponse> => {
  const { data } = await axiosInstance.post<CreateOrderResponse>("/orders", {
    shipping_address,
  });
  return data;
};

export const getMyOrders = async (): Promise<Order[]> => {
  const { data } = await axiosInstance.get<{ orders: Order[] }>("/orders/my-orders");
  return data.orders;
};

export const getOrderById = async (id: number): Promise<OrderDetails> => {
  const { data } = await axiosInstance.get<{ order: OrderDetails }>(`/orders/${id}`);
  return data.order;
};

export const getAllOrders = async (): Promise<AdminOrder[]> => {
  const { data } = await axiosInstance.get<{ orders: AdminOrder[] }>("/orders");
  return data.orders;
};

export const updateOrderStatus = async (
  id: number,
  status: OrderStatus
): Promise<{ message: string }> => {
  const { data } = await axiosInstance.patch<{ message: string }>(
    `/orders/${id}/status`,
    { status }
  );
  return data;
};