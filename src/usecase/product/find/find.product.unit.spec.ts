import Product from "../../../domain/product/entity/product";
import FindProductUseCase from "./find.product.usecase";

describe("Unit Test find product use case", () => {
  let MockRepository: any;
  beforeAll(() => {
    const product = new Product("123", "any_product", 10);

    MockRepository = () => {
      return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      };
    };
  });
  it("should find a product", async () => {
    const productRepository = MockRepository();
    const usecase = new FindProductUseCase(productRepository);

    const input = {
      id: "123",
    };

    const output = {
      id: "123",
      name: "any_product",
      price: 10,
    };

    const result = await usecase.execute(input);

    expect(result).toEqual(output);
  });

  it("should not find a product", async () => {
    const productRepository = MockRepository();
    productRepository.find.mockImplementation(() => {
      throw new Error("Product not found");
    });
    const usecase = new FindProductUseCase(productRepository);

    const input = {
      id: "123",
    };

    expect(() => {
      return usecase.execute(input);
    }).rejects.toThrow("Product not found");
  });
});
