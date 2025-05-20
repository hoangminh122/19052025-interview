import { BelongsToMany, Model, CreatedAt, UpdatedAt, Column, DeletedAt, DataType, HasMany, IsUUID, PrimaryKey, Sequelize, Table } from "sequelize-typescript";
import { Role } from "./Role.entity";
import { UserRole } from "./UserRole.entity";

@Table({
    tableName:'user',
    timestamps: true,
    paranoid: true
})
export class User extends Model {
    @IsUUID(4)
    @PrimaryKey
    @Column({
        type:DataType.UUID,
        defaultValue:Sequelize.literal('uuid_generate_v4()')
    })
    id!:string;

    @Column({
        allowNull: true,
        type:DataType.STRING,
        field: 'first_name'
    })
    firstName: string;
    
    @Column({
        allowNull: true,
        type:DataType.STRING,
        field: 'last_name'
    })
    lastName: string;

    @Column({
        allowNull:false,
        type:DataType.STRING,
        unique:true
    })
    email:string;

    @Column({
        allowNull:true,
        type:DataType.STRING,
        unique:true
    })
    phone:string;

    @Column({
        allowNull:true,
        type:DataType.STRING,
        unique:true
    })
    username: string;

    @Column({
        allowNull:false,
        type:DataType.STRING
    })
    password:string;

    @Column({
        allowNull:true,
        defaultValue:false,
        type:DataType.BOOLEAN
    })
    isVerify:boolean;

    @Column({
        defaultValue:false,
        type:DataType.BOOLEAN
    })
    isActive:boolean;

    @Column({
        defaultValue: [],
        type: DataType.JSONB
    })
    socketIds: string[];

    @CreatedAt
    @Column({ allowNull: true, field: 'created_at', type: DataType.DATE })
    public createdAt: Date;

    @UpdatedAt
    @Column({  allowNull: true,field: 'updated_at', type: DataType.DATE })
    public updatedAt: Date;

    @DeletedAt
    @Column({  allowNull: true,field: 'deleted_at', type: DataType.DATE })
    public deletedAt: Date;

    @BelongsToMany(() => Role, {
        through: {
          model: () => UserRole,
        },
        foreignKey: 'user_id',
    
        constraints: false,
    })
    roles?: Role[];

    @HasMany(() => UserRole, 'user_id')
    userRoles?: UserRole[];

}