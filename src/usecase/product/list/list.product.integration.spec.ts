import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";
import ProductB from "../../../domain/product/entity/product-b";

describe("Integration test list product use case", () => {
  let sequelize: Sequelize;
  let input: any;
  let products: any;
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();

    products = [
      {
        id: "id_1",
        name: "any_product",
        price: 10,
      },
      {
        id: "id_2",
        name: "other_product",
        price: 10,
      },
    ];
  });

  afterEach(async () => {
    await sequelize.close();
  });
  it("should list a product", async () => {
    const product = new Product(
      products[0].id,
      products[0].name,
      products[0].price
    );
    await ProductModel.create({
      id: product.id,
      name: product.name,
      price: product.price,
    });
    const product2 = new ProductB(
      products[1].id,
      products[1].name,
      products[1].price
    );
    await ProductModel.create({
      id: product2.id,
      name: product2.name,
      price: product2.price,
    });
    const productRepository = new ProductRepository();
    const usecase = new ListProductUseCase(productRepository);

    const output = await usecase.execute(input);

    expect(output.products.length).toBe(2);
    expect(output.products[0].id).toBe(products[0].id);
    expect(output.products[0].name).toBe(products[0].name);
    expect(output.products[0].price).toBe(products[0].price);
    expect(output.products[1].id).toBe(products[1].id);
    expect(output.products[1].name).toBe(products[1].name);
    expect(output.products[1].price).toBe(products[1].price * 2);
  });
  it("should throw an error, if not exists a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new ListProductUseCase(productRepository);

    const output = await usecase.execute(input);
    expect(output.products.length).toBe(0);
  });
});
