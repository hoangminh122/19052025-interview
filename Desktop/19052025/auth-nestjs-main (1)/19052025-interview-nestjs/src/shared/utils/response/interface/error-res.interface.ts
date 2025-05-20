import { IResponse } from "./response.interface";

export class IErrorResponse implements IResponse {
    success: boolean;
    error: string
};
