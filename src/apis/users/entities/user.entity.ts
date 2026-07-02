import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
} from 'typeorm';
import { RoleEnum } from '../../../etc/enum';
import { Buyer } from './buyer.entity';
import { Seller } from './seller.entity';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({
        name: 'email',
        type: 'varchar',
        length: 50,
        unique: true,
    })
    email: string;

    @Column({
        name: 'password',
        type: 'varchar',
        length: 128,
        nullable: true,
    })
    password: string;

    @Column({
        name: 'role',
        type: 'enum',
        enum: RoleEnum,
        enumName: 'role_enum',
    })
    role: RoleEnum;

    @Column({
        name: 'full_name',
        type: 'varchar',
        length: 48,
    })
    fullName: string;

    @Column({
        name: 'dob',
        type: 'date',
    })
    dob: Date;

    @Column({
        name: 'is_active',
        default: true,
    })
    isActive: boolean;

    @OneToOne(() => Buyer, (buyer) => buyer.user)
    buyer: Buyer;

    @OneToOne(() => Seller, (seller) => seller.user)
    seller: Seller;
}