import Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";
import CreateProductUseCase from "./create.product.usecase";

const input = {
  name: "any_product",
  type: "a",
  price: 20,
};

describe("Unit test create product use case", () => {
  let MockRepository: any;
  beforeAll(() => {
    jest.spyOn(ProductFactory, "create").mockImplementation(() => {
      return new Product("any_id", "any_product", 20);
    });
    MockRepository = () => {
      return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      };
    };
  });
  it("should create a product", async () => {
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const output = await productCreateUseCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    });
  });

  it("should thrown an error when product factory throw an error", async () => {
    const productRepository = MockRepository();
    jest.spyOn(ProductFactory, "create").mockImplementationOnce(() => {
      throw new Error();
    });
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    await expect(productCreateUseCase.execute(input)).rejects.toThrow();
  });
  it("should thrown an error when product repository throw an error", async () => {
    const productRepository = MockRepository();
    jest.spyOn(productRepository, "create").mockImplementationOnce(() => {
      throw new Error();
    });
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    await expect(productCreateUseCase.execute(input)).rejects.toThrow();
  });
});

// describe("Unit test create product use case", () => {
//     it("should create a product", async () => {
//       const productRepository = MockRepository();
//       const productCreateUseCase = new CreateProductUseCase(productRepository);

//       const output = await productCreateUseCase.execute(input);

//       expect(output).toEqual({
//         id: expect.any(String),
//         name: input.name,
//         price: input.price,
//       });
//     });
