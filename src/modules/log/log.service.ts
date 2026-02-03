import type { Request, Response } from 'express';

import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { createLogger, format, transports } from 'winston';

import axios from 'axios';

import { envs } from '@configs';

@Injectable()
export class LogService {
  private readonly discordWebhookUrl = envs.discordWebhookUrl;

  logger = new Logger('', { timestamp: true });

  saveFileLog(req: Request, res: Response): void {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    const fileErrorTransport = new transports.File({
      filename: `logs/${formattedDate}-info.log`,
      format: format.combine(
        format.json(),
        format.printf((info) => JSON.stringify(info.message)),
      ),
    });

    const logger = createLogger({ transports: [fileErrorTransport] });

    const userId = req?.user?._id ? String(req.user._id) : 'N/A';
    const messageLog = `Method: ${req.method}, User Id: ${userId}, Time: ${date.toLocaleString()}, Path: ${req.path}, Status: ${res.statusCode}`;

    logger.info(messageLog);
  }

  errorLog(exception: Error) {
    this.logger.error(exception.message, exception.stack);
  }

  async sendDiscordLog(req: Request, status: HttpStatus, exception: Error) {
    const referer = req.headers.referer || 'N/A';
    const authorization = req.headers.authorization || 'N/A';
    const platform = String(req.headers['sec-ch-ua-platform'] || 'N/A');

    const message = {
      content: `\`\`\`yaml
      \nMethod: ${req.method}
      \nPath: ${req.url}
      \nStatus: ${status}
      \nError: ${exception.message}
      \nStack: ${exception.stack}
      \nHeaders:\nReferer: ${referer}\nAuthorization: ${authorization}\nPlatform: ${platform}
      \nBody: ${JSON.stringify(req.body)}\n\`\`\``,
      username: `Short URL - ${envs.nodeEnv}`,
    };

    try {
      await axios.post(this.discordWebhookUrl, message);
    } catch (error) {
      this.logger.error('Failed to send notification to Discord', error);
      this.logger.error({ message });
      this.logger.error({ exception });
    }
  }
}
