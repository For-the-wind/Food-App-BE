import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'sellers' })
export class Seller {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, (user) => user.seller, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({
        name: 'store_name',
        type: 'varchar',
        length: 100,
    })
    storeName: string;

    @Column({
        name: 'store_description',
        type: 'text',
        nullable: true,
    })
    storeDescription?: string;

    @Column({
        name: 'store_address',
        type: 'varchar',
        length: 255,
    })
    storeAddress: string;

    @Column({
        name: 'merchant_type',
        type: 'varchar',
        length: 50,
    })
    merchantType: string;

    @Column({
        name: 'average_rating',
        type: 'decimal',
        precision: 3,
        scale: 2,
        default: 0,
    })
    averageRating: number;

    @Column({
        name: 'rating_count',
        type: 'integer',
        default: 0,
    })
    ratingCount: number;

    @Column({
        name: 'rating_sum',
        type: 'integer',
        default: 0,
    })
    ratingSum: number;
}