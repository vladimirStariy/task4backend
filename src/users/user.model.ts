import { Model, Table, DataType, Column } from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";

interface IUser {
    email: string;
    name: string;
    password: string;
}

@Table( {tableName: 'users'} )
export class User extends Model<User, IUser> {
    @ApiProperty({example: '1', description: 'Unique dentificator'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Username', description: 'User name'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @Column({type: DataType.DATE, defaultValue: new Date()})
    registeredAt: Date;

    @Column({type: DataType.DATE, allowNull: true})
    lastLogin: Date;

    @Column({type: DataType.BOOLEAN, defaultValue: false})
    isBanned: boolean;
    
    @Column({type: DataType.STRING, allowNull: false})
    password: string;
}