import { useContainer as classValidatorUseContainer } from 'class-validator';
import {
  MicroframeworkLoader,
  MicroframeworkSettings,
} from 'microframework-w3tec';
import { useContainer as routingUseContainer } from 'routing-controllers';
import { useContainer as ormUseContainer } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';

export const iocLoader: MicroframeworkLoader = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  settings: MicroframeworkSettings | undefined
) => {
  /**
   * Setup routing-controllers to use typedi container.
   */
  routingUseContainer(Container);
  ormUseContainer(Container);
  classValidatorUseContainer(Container);
};
