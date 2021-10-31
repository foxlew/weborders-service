import { Validate } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { countries } from './countries';
import { EntityBase } from './EntityBase';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  line1: string;

  @Column({ default: null })
  line2: string;

  @Column({ default: null })
  city: string;

  @Column({ default: null })
  zipCode: string;

  @Column({ default: null })
  @Validate((country: string) => (country ? !!countries[country] : true))
  country: string;

  @Column(() => EntityBase, { prefix: '' })
  base: EntityBase;
}
