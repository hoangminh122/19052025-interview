import { Column, CreatedAt, DataType, DeletedAt, ForeignKey, Model, Table, UpdatedAt } from "sequelize-typescript";
import { Permission } from "./Permission.entity";
import { Role } from "./Role.entity";

@Table({ tableName: 'permission_role', timestamps: true })
export class RolePermission extends Model {

    @Column({
        field: 'permission_id',
        primaryKey: true,
        type: DataType.STRING(50)
    })
    @ForeignKey(() => Permission)
    permissionId!: string

    @Column({
        field: 'role_id',
        primaryKey: true,
        type: DataType.STRING(50)
    })
    @ForeignKey(() => Role)
    roleId!: string;

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