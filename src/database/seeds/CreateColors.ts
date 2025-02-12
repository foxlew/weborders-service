import { Connection } from 'typeorm';
import { Factory, Seeder, times } from 'typeorm-seeding';

import { Color } from '../../api/models';

export class CreateColors implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    const em = connection.createEntityManager();
    await times(10, async () => {
      const color = await factory(Color)().make();
      return em.save(color);
    });
  }
}
