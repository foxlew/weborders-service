import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Validate } from 'class-validator';

import { IShoeModel, ShoeModelType, shoeModelTypes } from '../../types';
import { OwnedEntity } from './base/OwnedEntity';
import { Component } from './Component';

@Entity()
@Unique(['reference', 'owner'])
export class ShoeModel implements IShoeModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Validate((type) => shoeModelTypes.includes(type))
  @Column({ type: 'enum', enum: shoeModelTypes })
  type: ShoeModelType;

  @Column({ default: null })
  reference?: string;

  @ManyToMany(() => Component, { cascade: false })
  @JoinTable()
  components: Component[];

  @Column({ default: null })
  dateCreated?: Date;

  @Column({ default: null })
  notes?: string;

  @Column(() => OwnedEntity, { prefix: '' })
  base: OwnedEntity;
}
