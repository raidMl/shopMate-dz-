import axios from 'axios';
import { Order } from '../types/order';

const API_URL = '/api/orders';

export const fetchOrders = async (): Promise<Order[]> => {
    const response = await axios.get<Order[]>(API_URL);
    return response.data;
};

export const fetchOrderById = async (id: string): Promise<Order> => {
    const response = await axios.get<Order>(`${API_URL}/${id}`);
    return response.data;
};

export const createOrder = async (order: Order): Promise<Order> => {
    const response = await axios.post<Order>(API_URL, order);
    return response.data;
};

export const updateOrder = async (id: string, order: Order): Promise<Order> => {
    const response = await axios.put<Order>(`${API_URL}/${id}`, order);
    return response.data;
};

export const deleteOrder = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};