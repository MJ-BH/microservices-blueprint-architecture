export class ApiResult<T> {
    public code: number;
    public status: 'success' | 'error';
    public message: string;
    public data: T | null;

    private constructor(code: number, message: string, data: T | null = null) {
        this.code = code;
        this.status = code >= 200 && code < 300 ? 'success' : 'error';
        this.message = message;
        this.data = data;
    }

    // ✅ Static Helper for Success (200)
    public static success<T>(data: T, message: string = 'Operation successful'): ApiResult<T> {
        return new ApiResult<T>(200, message, data);
    }

    // ✅ Static Helper for Created (201)
    public static created<T>(data: T, message: string = 'Resource created successfully'): ApiResult<T> {
        return new ApiResult<T>(201, message, data);
    }

    // ❌ Static Helper for Errors (400, 404, 500...)
    public static error(message: string, code: number = 500, data: any = null): ApiResult<any> {
        return new ApiResult<any>(code, message, data);
    }
}