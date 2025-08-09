import { Context } from '@midwayjs/koa';
import { OrderService } from '../service/order.service';
export declare class OrderController {
    ctx: Context;
    orderService: OrderService;
    getUserOrders(page?: number, limit?: number, status?: string): Promise<{
        success: boolean;
        data: {
            orders: import("../entity/order.entity").Order[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getOrderById(id: number): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: import("../entity/order.entity").Order;
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    updateOrderStatus(id: number, status: string): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: import("../entity/order.entity").Order;
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
}
export declare class AdminOrderController {
    ctx: Context;
    orderService: OrderService;
    getAllOrders(page?: number, limit?: number, status?: string, userId?: number): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: {
            orders: import("../entity/order.entity").Order[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    adminUpdateOrderStatus(id: number, status: string): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: import("../entity/order.entity").Order;
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getOrderStats(): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: {
            totalOrders: number;
            totalRevenue: any;
            statusStats: {
                status: any;
                count: number;
                totalAmount: number;
            }[];
            recentOrders: import("../entity/order.entity").Order[];
            popularBlindBoxes: {
                id: any;
                name: any;
                orderCount: number;
                revenue: number;
            }[];
        };
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    deleteOrder(id: number): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
    }>;
}
