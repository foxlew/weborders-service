import { defaultMetadataStorage as classTransformerMetadataStorage } from 'class-transformer/cjs/MetadataStorage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import basicAuth from 'express-basic-auth';
import {
  MicroframeworkLoader,
  MicroframeworkSettings,
} from 'microframework-w3tec';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUi from 'swagger-ui-express';

import { env } from '../env';
import { expressDefaults } from './expressLoader';

export const swaggerLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined
) => {
  if (settings && env.swagger.enabled) {
    const expressApp = settings.getData('express_app');

    const schemas: any = validationMetadatasToSchemas({
      classTransformerMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
    });

    const swaggerFile = routingControllersToSpec(
      getMetadataArgsStorage(),
      { defaults: expressDefaults },
      {
        components: {
          schemas,
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
            },
          },
        },
      }
    );

    // Add npm infos to the swagger doc
    swaggerFile.info = {
      title: env.app.name,
      description: env.app.description,
      version: env.app.version,
    };

    swaggerFile.servers = [
      {
        url: `${env.app.schema}://${env.app.host}:${env.app.port}${env.app.routePrefix}`,
      },
    ];

    expressApp.use(
      env.swagger.route,
      env.swagger.username
        ? basicAuth({
            users: {
              [`${env.swagger.username}`]: env.swagger.password,
            },
            challenge: true,
          })
        : (req, res, next) => next(),
      swaggerUi.serve,
      swaggerUi.setup(swaggerFile)
    );
  }
};
