import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUseCase from "./find.product.usecase";

describe("Integration test find product use case", () => {
  let sequelize: Sequelize;
  let input: any;
  let output: any;
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
      id: "any_id",
    };

    output = {
      id: "any_id",
      name: "any_product",
      price: 10,
    };
  });

  afterEach(async () => {
    await sequelize.close();
  });
  it("should find a product", async () => {
    const product = new Product(input.id, "any_product", 10);
    await ProductModel.create({
      id: product.id,
      name: product.name,
      price: product.price,
    });
    const productRepository = new ProductRepository();
    const usecase = new FindProductUseCase(productRepository);

    const result = await usecase.execute(input);

    expect(result).toEqual(output);
  });
  it("should throw an error, if not find a product", async () => {
    const product = new Product(input.id, "any_product", 10);
    await ProductModel.create({
      id: product.id,
      name: product.name,
      price: product.price,
    });
    const productRepository = new ProductRepository();
    const usecase = new FindProductUseCase(productRepository);

    input.id = "other_id";

    expect(usecase.execute(input)).rejects.toThrow();
  });
});
