import { BelongsToMany, Model, CreatedAt, UpdatedAt, Column, DeletedAt, DataType, HasMany, IsUUID, PrimaryKey, Sequelize, Table } from "sequelize-typescript";
import { TypeRole } from "src/shared/enums/role-enum";
import { Permission } from "./Permission.entity";
import { RolePermission } from "./RolePermission.entity";
import { User } from "./User.entity";
import { UserRole } from "./UserRole.entity";

@Table({tableName:'role',timestamps: true})
export class Role extends Model {
    @IsUUID(4)
    @PrimaryKey
    @Column({
        type:DataType.UUID,
        defaultValue:Sequelize.literal('uuid_generate_v4()')
    })
    id!:string;

    
    @Column({
        type: DataType.ENUM({ values: Object.keys(TypeRole) }),
        allowNull: false,
        unique: true
    })
    name: TypeRole;

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

    @BelongsToMany(() => User, {
        through: {
          model: () => UserRole,
        },
        foreignKey: 'role_id',
    
        constraints: false,
    })
    users?: User[];

    @BelongsToMany(() => Permission, {
        through: {
          model: () => RolePermission,
        },
        foreignKey: 'role_id',
    
        constraints: false,
    })
    permissions?: Permission[];

    @HasMany(() => UserRole, 'role_id')
    userRoles?: UserRole[];

    @HasMany(() => RolePermission, 'role_id')
    rolePermissions?: RolePermission[];
}