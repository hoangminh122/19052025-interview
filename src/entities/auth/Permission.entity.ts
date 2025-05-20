import { BelongsToMany, Model, CreatedAt, UpdatedAt, Column, DeletedAt, DataType, HasMany, IsUUID, PrimaryKey, Sequelize, Table } from "sequelize-typescript";
import { TypePermission } from "src/shared/enums/role-enum";
import { Role } from "./Role.entity";
import { RolePermission } from "./RolePermission.entity";

@Table({ tableName: 'permission', timestamps: true })
export class Permission extends Model {
    @IsUUID(4)
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
    })
    id!: string;

    @Column({
        type: DataType.ENUM({ values: Object.keys(TypePermission) }),
        allowNull: false,
        unique: true
    })
    name: TypePermission;

    @Column({
        field: 'description'
    })
    description: string;

    @CreatedAt
    @Column({ field: 'created_at', type: DataType.DATE })
    public createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at', type: DataType.DATE })
    public updatedAt: Date;

    @DeletedAt
    @Column({ field: 'deleted_at', type: DataType.DATE })
    public deletedAt: Date;

    @BelongsToMany(() => Role, {
        through: {
            model: () => RolePermission,
        },
        foreignKey: 'permission_id',

        constraints: false,
    })
    roles?: Role[];

    @HasMany(() => RolePermission, 'permission_id')
    rolePermissions?: RolePermission[];
}