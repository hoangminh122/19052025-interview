import { IResponse } from "./response.interface";

export class ISuccessResponse implements IResponse {
    success: boolean;
    result: any
};
