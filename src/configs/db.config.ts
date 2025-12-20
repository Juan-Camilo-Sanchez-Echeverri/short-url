import { Injectable } from '@nestjs/common';

import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

import { Connection, MongooseQueryOrDocumentMiddleware } from 'mongoose';

import paginate from 'mongoose-paginate-v2';

import { envs } from './envs.config';

import { ExecModes } from '@common/enums/exec-modes.enum';

import { validateMongo } from '@common/helpers/mongo.helpers';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: envs.dbUrl,
      retryAttempts: 10,
      retryDelay: 3000,
      connectionFactory: (connection: Connection) => {
        connection.set('debug', envs.nodeEnv === ExecModes.LOCAL);
        connection.plugin(paginate);

        connection.plugin((schema) => {
          const methodsValidation: MongooseQueryOrDocumentMiddleware[] = [
            'find',
            'countDocuments',
            'save',
            'findOneAndUpdate',
            'updateOne',
          ];

          schema.post(methodsValidation, validateMongo);
        });

        return connection;
      },
    };
  }
}
