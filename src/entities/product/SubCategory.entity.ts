import { Table, Column, ForeignKey, Model, HasMany, BelongsTo, UpdatedAt, CreatedAt, DataType } from "sequelize-typescript";
import { Category } from "./Category.entity";
import { Product } from "./Product.entity";

@Table
export class Subcategory extends Model {
    @Column({ allowNull: false })
    name: string;

    @ForeignKey(() => Category)
    @Column
    categoryId: number;

    @BelongsTo(() => Category)
    category: Category;

    @HasMany(() => Product)
    products: Product[];

    @CreatedAt
    @Column({ field: 'created_at', type: DataType.DATE })
    public createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at', type: DataType.DATE })
    public updatedAt: Date;
}
