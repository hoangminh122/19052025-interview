import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface'
import { Response } from 'express'
import { LoggerService } from 'src/modules/logger/logger.service'
import { IErrorResponse } from '../utils/response/interface/error-res.interface'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: HttpException | Error, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp()
    const response: Response = ctx.getResponse()
    const request = ctx.getRequest();
    
    // Handling error message and logging
    this.handleMessage(exception, request)
    
    // Response to client
    HttpExceptionFilter.handleResponse(response, exception)
  }
  
  private handleMessage(exception: HttpException | Error, request?): void {
    let message = HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR]
    const endpoint = request?.route?.path || '';
    if (exception instanceof HttpException) {
      message = JSON.stringify(exception.getResponse())
    } else if (exception instanceof Error) {
      message = exception.stack.toString()
    }

    message = `[${endpoint}]: ${message}`
    this.logger.error(message)
  }
  
  private static handleResponse(response: Response , exception: HttpException | Error): void {
    let responseBody: IErrorResponse = { error: HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR], success: false };
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR
    if (exception instanceof HttpException) {
      responseBody.error = (exception.getResponse() as any)?.message?.toString() ?? HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR];
      statusCode = exception.getStatus();
      
    } else if (exception instanceof Error) {
      responseBody = {
        error: exception.stack,
        success: false
      }
    }

    response.status(statusCode).json(responseBody)
  }
}