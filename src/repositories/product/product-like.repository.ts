import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../base.repository";
import { ProductLike } from "src/entities/product/ProductLike.enity";

@Injectable()
export class ProductLikeRepository extends BaseRepository<ProductLike> {
    constructor() {
        super(ProductLike);
    }
}