import { Table, Model, HasMany, Column, CreatedAt, UpdatedAt, DataType } from "sequelize-typescript";
import { Subcategory } from "./SubCategory.entity";

@Table
export class Category extends Model {
    @Column({ allowNull: false })
    name: string;

    @HasMany(() => Subcategory)
    subcategories: Subcategory[];

    @CreatedAt
    @Column({ field: 'created_at', type: DataType.DATE })
    public createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at', type: DataType.DATE })
    public updatedAt: Date;
}
