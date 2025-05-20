import { Column, CreatedAt, DataType, DeletedAt, ForeignKey, Model, Table, UpdatedAt } from "sequelize-typescript";
import { Role } from "./Role.entity";
import { User } from "./User.entity";

@Table({tableName:'user_role', timestamps: true})
export class UserRole extends Model {
    
    @ForeignKey(()=>User)
    @Column({
        field:'user_id',
        primaryKey:true,
        type:DataType.STRING(50)
    })
    userId!:string

    @ForeignKey(()=>Role)
    @Column({
        field:'role_id',
        primaryKey:true,
        type:DataType.STRING(50)
    })
    roleId!:string;

    @CreatedAt
    @Column({ field: 'created_at', type: DataType.DATE })
    public createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at', type: DataType.DATE })
    public updatedAt: Date;

    @DeletedAt
    @Column({ field: 'deleted_at', type: DataType.DATE })
    public deletedAt: Date;

}