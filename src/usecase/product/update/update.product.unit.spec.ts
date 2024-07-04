import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";

describe("Unit test for product update use case", () => {
  let MockRepository: any;
  let input: any;
  beforeAll(() => {
    const product = new Product("any_id", "other_product", 10);

    input = {
      id: product.id,
      name: product.name,
      price: product.price,
    };
    MockRepository = () => {
      return {
        create: jest.fn(),
        findAll: jest.fn(),
        find: jest
          .fn()
          .mockImplementation(() => new Product("any_id", "any_product", 15)),
        update: jest.fn(),
      };
    };
  });
  it("should update a product", async () => {
    const productRepository = MockRepository();
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

    const output = await productUpdateUseCase.execute(input);

    expect(output).toEqual(input);
  });
});
