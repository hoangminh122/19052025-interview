import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../base.repository";
import { Category } from "src/entities/product/Category.entity";

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
    constructor() {
        super(Category);
    }
}