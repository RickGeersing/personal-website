export type ResponseData<T> = {
    message?: string;
    body: T;
    success: boolean;
    code?: string;
};

export type FindManyResponse<T> = ResponseData<PaginatedResults<T>>;
export type FindUniqueResponse<T> = ResponseData<T>;
export type CreateResponse<T> = ResponseData<T>;
export type UpdateResponse<T> = ResponseData<T>;

export type PaginatedResults<T> = {
    results: T[];
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrevious: boolean;
};