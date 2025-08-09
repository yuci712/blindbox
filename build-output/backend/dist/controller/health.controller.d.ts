export declare class HealthController {
    health(): Promise<{
        success: boolean;
        status: string;
        timestamp: string;
        message: string;
    }>;
}
