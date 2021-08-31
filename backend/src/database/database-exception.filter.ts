import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';

@Catch(QueryFailedError, EntityNotFoundError)
export class DatabaseExceptionFilter<T> implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let message = exception.message;
    const resource = exception.table;
    let status = HttpStatus.UNPROCESSABLE_ENTITY;

    if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
    }

    if (exception.detail?.includes('already exists')) {
      message = `${resource} already exists`;
    }

    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
    });
  }
}
