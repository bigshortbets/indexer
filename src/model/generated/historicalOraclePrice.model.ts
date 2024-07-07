import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class HistoricalOraclePrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 18, scale: 8 })
  price: number;

  @Column()
  asset: string;

  @CreateDateColumn()
  timestamp: Date;
}