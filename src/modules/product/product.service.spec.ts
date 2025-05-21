import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductRepository } from 'src/repositories/product/product.repository';
import { CategoryRepository } from 'src/repositories/product/category.repository';
import { ProductLikeRepository } from 'src/repositories/product/product-like.repository';
import { NotFoundException } from '@nestjs/common';
import { SortType } from 'src/shared/enums/common.enum';
import { REPOSITORY_NAME } from 'src/shared/constant/repository-config.constant';

const mockProductRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
};

const mockCategoryRepository = {
    findOne: jest.fn(),
};

const mockProductLikeRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
};

describe('ProductService', () => {
    let service: ProductService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                { provide: REPOSITORY_NAME.PRODUCT_REPOSITORY, useValue: mockProductRepository },
                { provide: REPOSITORY_NAME.CATEGORY_REPOSITORY, useValue: mockCategoryRepository },
                {
                    provide: REPOSITORY_NAME.PRODUCT_LIKE_REPOSITORY,
                    useValue: mockProductLikeRepository,
                },
            ],
        }).compile();

        service = module.get<ProductService>(ProductService);
    });

    afterEach(() => jest.clearAllMocks());

    it('test paginate products', async () => {
        const mockProducts = [{ id: 1, name: 'Laptop Dell' }];
        mockProductRepository.findAll.mockResolvedValue(mockProducts);

        const result = await service.getPaginatedProducts({
            q: 'laptop',
            page: 0,
            limit: 10,
            sortBy: 'name',
            sortType: SortType.ASC,
        });

        expect(result).toEqual(mockProducts);
    });

    it('throw 404 if subcategory not found', async () => {
        const payload = { name: 'Laptop HP', price: 1000, subcategoryId: 1 };
        mockCategoryRepository.findOne.mockResolvedValue(null);

        await expect(service.create(payload)).rejects.toThrow(NotFoundException);
    });

    it('create a product success when subcategory existed', async () => {
        const payload = { name: 'Laptop HP', price: 1000, subcategoryId: 1 };
        mockCategoryRepository.findOne.mockResolvedValue({ id: 1 });
        mockProductRepository.create.mockResolvedValue(payload);

        const result = await service.create(payload);
        expect(result).toEqual(payload);
    });

    it('Up like a product if not liked before', async () => {
        const product = { id: 1, countLikes: 0, increment: jest.fn(), decrement: jest.fn() };
        mockProductRepository.findOne.mockResolvedValue(product);
        mockProductLikeRepository.findOne.mockResolvedValue(null);
        mockProductLikeRepository.create.mockResolvedValue({});

        const result = await service.toggleLike(1, 'userTest');
        expect(product.increment).toHaveBeenCalledWith('countLikes');
        expect(result).toBe(true);
    });

    it('Down like a product if liked before', async () => {
        const product = { id: 1, countLikes: 4, increment: jest.fn(), decrement: jest.fn() };
        const existingLike = { destroy: jest.fn() };

        mockProductRepository.findOne.mockResolvedValue(product);
        mockProductLikeRepository.findOne.mockResolvedValue(existingLike);

        const result = await service.toggleLike(1, 'userTest');
        expect(product.decrement).toHaveBeenCalledWith('countLikes');
        expect(result).toBe(true);
    });
});
