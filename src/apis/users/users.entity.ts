import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEnum } from '../../etc/enum';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'email', type: 'varchar', length: 50 })
    email: string;

    @Column({ name: 'password', type: 'varchar', length: 128, nullable: true })
    password: string;

    @Column({
        name: 'role',
        type: 'enum',
        enum: RoleEnum,
        default: RoleEnum.USER,
        enumName: 'role_enum',
    })
    role: RoleEnum;

    @Column({ name: 'fullName', type: 'varchar', length: 48 })
    fullName: string;

    @Column({ name: 'dob', type: 'date' })
    dob: Date;

    @Column({ default: true })
    isActive: boolean;
}
