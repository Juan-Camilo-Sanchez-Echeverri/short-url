import { Request, Response } from 'express';

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { ErrorsResponse } from '../responses/errors.response';

import { envs } from '@configs';

import { ExecModes } from '@common/enums';

import { LogService } from '@modules/log/log.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logService: LogService) {}

  async catch(exception: Error, host: ArgumentsHost): Promise<Response> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status: HttpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const isInternalServerError = Math.floor(status / 100) === 5;
    const isProdEnvironment = envs.nodeEnv !== ExecModes.LOCAL;

    if (isInternalServerError && isProdEnvironment) {
      await this.logService.sendDiscordLog(request, status, exception);
    }

    if (isInternalServerError || !isProdEnvironment) {
      this.logService.errorLog(exception);
    }

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorMessage = this.extractMessage(exceptionResponse);
    const errorCode = this.extractCode(exceptionResponse);
    const errors = this.extractErrors(exceptionResponse);

    const responseBody: ErrorsResponse = {
      code: errorCode,
      message: errorMessage,
      errors: errors.length > 0 ? errors : undefined,
    };

    return response.status(status).json(responseBody);
  }

  private extractMessage(response: string | object): string {
    if (typeof response === 'object' && 'message' in response) {
      return response.message as string;
    }

    return response as string;
  }

  private extractCode(response: string | object): number | null {
    if (typeof response === 'object' && 'code' in response) {
      return response.code as number;
    }
    return null;
  }

  private extractErrors(
    response: string | object,
  ): Array<{ property: string; errors: string[] }> {
    if (typeof response === 'object' && 'errors' in response) {
      return response.errors as Array<{ property: string; errors: string[] }>;
    }
    return [];
  }
}
