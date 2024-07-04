import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

describe("Unit test for product update use case", () => {
  let input: any;
  let sequelize: Sequelize;
  let product: Product;

  beforeAll(() => {
    product = new Product("any_id", "any_product", 10);
  });
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
      id: product.id,
      name: "other_product",
      price: 20,
    };
  });

  afterEach(async () => {
    await sequelize.close();
  });
  it("should update a product", async () => {
    await ProductModel.create({
      id: product.id,
      name: product.name,
      price: product.price,
    });
    const productRepository = new ProductRepository();
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

    const output = await productUpdateUseCase.execute(input);

    expect(output).toEqual(input);
  });
});
