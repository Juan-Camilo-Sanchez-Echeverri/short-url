import { INestApplication } from '@nestjs/common';

import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

const swaggerConfig = new DocumentBuilder()
  .setTitle('Short URL API')
  .setDescription('The API for the Short URL project')
  .setVersion('1.0.0')
  .addGlobalResponse({
    status: 500,
    description: 'Internal Server Error',
    example: { code: null, message: 'Internal Server Error' },
  })
  .addBearerAuth()
  .build();

const swaggerDocOptions: SwaggerDocumentOptions = {
  ignoreGlobalPrefix: false,
};

export const setupSwagger = (app: INestApplication): void => {
  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerDocOptions,
  );

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
      tagsSorter: 'alpha',
    },
  });
};
