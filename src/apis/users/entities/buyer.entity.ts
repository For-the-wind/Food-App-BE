import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'buyers' })
export class Buyer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, (user) => user.buyer, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({
        name: 'phone',
        type: 'varchar',
        length: 20,
        nullable: true,
    })
    phone?: string;

    @Column({
        name: 'address',
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    address?: string;

    @Column({
        name: 'latitude',
        type: 'decimal',
        precision: 10,
        scale: 7,
        nullable: true,
    })
    latitude?: number;

    @Column({
        name: 'longitude',
        type: 'decimal',
        precision: 10,
        scale: 7,
        nullable: true,
    })
    longitude?: number;

    @Column({
        name: 'dietary_preferences',
        type: 'text',
        array: true,
        default: '{}',
    })
    dietaryPreferences: string[];

    @Column({
        name: 'search_radius',
        type: 'integer',
        default: 5,
    })
    searchRadius: number;
}