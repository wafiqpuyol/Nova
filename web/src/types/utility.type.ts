export interface formateErrResponseType {
    message: string;
    data: unknown;
    path?: (string | number)[];
}