import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";
import CreateProductUseCase from "./create.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

describe("Integration test create product use case", () => {
  let sequelize: Sequelize;
  let input: any;
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();

    input = {
      name: "any_product",
      type: "a",
      price: 20,
    };
  });

  afterEach(async () => {
    await sequelize.close();
  });
  it("should create a product", async () => {
    const productRepository = new ProductRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const spyProductFactory = jest.spyOn(ProductFactory, "create");
    const spyProductRepository = jest.spyOn(productRepository, "create");
    const output = await productCreateUseCase.execute(input);

    expect(spyProductFactory).toHaveBeenCalledWith(
      input.type,
      input.name,
      input.price
    );

    const product = new Product(expect.any(String), input.name, input.price);
    expect(spyProductRepository).toHaveBeenCalledWith(product);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    });

    const productResult = await ProductModel.findOne({
      where: { id: output.id },
    });
    expect(productResult).toBeDefined();
    expect(productResult.name).toBe(input.name);
    expect(productResult.price).toBe(input.price);
  });

  it("should thrown an error when product factory, recive a product type not supported", async () => {
    const productRepository = new ProductRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);
    input.type = "any_type";
    await expect(productCreateUseCase.execute(input)).rejects.toThrow(
      "Product type not supported"
    );
  });
  it("should thrown an error when product inputs are not valid", async () => {
    const productRepository = new ProductRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);
    input.name = "";
    await expect(productCreateUseCase.execute(input)).rejects.toThrow(
      "Name is required"
    );
    input.name = "any_product";
    input.price = -10;
    await expect(productCreateUseCase.execute(input)).rejects.toThrow(
      "Price must be greater than zero"
    );
  });
});
