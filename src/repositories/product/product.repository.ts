import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../base.repository";
import { Product } from "src/entities/product/Product.entity";

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
    constructor() {
        super(Product);
    }
}