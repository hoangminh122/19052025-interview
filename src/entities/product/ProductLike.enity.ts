import { Table, ForeignKey, Column, Model, BelongsTo, DataType, CreatedAt, UpdatedAt } from "sequelize-typescript";
import { User } from "../auth/User.entity";
import { Product } from "./Product.entity";

@Table
export class ProductLike extends Model {
    @ForeignKey(() => Product)
    @Column
    productId: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    userId: string;

    @BelongsTo(() => Product)
    product: Product;

    @BelongsTo(() => User)
    user: User;

    @CreatedAt
    @Column({ field: 'created_at', type: DataType.DATE })
    public createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at', type: DataType.DATE })
    public updatedAt: Date;
}
