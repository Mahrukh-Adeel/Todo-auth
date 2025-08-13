import { Request, Response, NextFunction } from 'express';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export const createSuccessResponse = <T>(data: T, message?: string): ApiResponse<T> => {
    return {
        success: true,
        data,
        message
    };
};

export const createErrorResponse = (error: string, statusCode?: number): ApiResponse => {
    return {
        success: false,
        error
    };
};

export const handleAsyncError = (fn: Function) => {
    return (req: any, res: any, next: any) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export const logError = (error: any, context?: string) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ${context ? `[${context}]` : ''} Error:`, error);
};
