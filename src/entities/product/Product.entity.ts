// src/products/product.model.ts
import {
    Table,
    Column,
    Model,
    DataType,
    HasMany,
    BelongsTo,
    ForeignKey,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';
import { ProductLike } from './ProductLike.enity';
import { Subcategory } from './SubCategory.entity';

@Table
export class Product extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    price: number;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    countLikes: number;

    @HasMany(() => ProductLike)
    likes: ProductLike[];

    @ForeignKey(() => Subcategory)
    @Column
    subcategoryId: number;

    @BelongsTo(() => Subcategory)
    subcategory: Subcategory;

    @CreatedAt
    @Column({ field: 'created_at', type: DataType.DATE })
    public createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at', type: DataType.DATE })
    public updatedAt: Date;
}
