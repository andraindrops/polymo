import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ProductForm from "@/components/domain/product/form";

const mockUpdate = vi.fn().mockResolvedValue({
  id: "product-id",
  name: "Updated Test Product",
  body: "Test Body",
  spec: "Test Spec",
});
const mockRemove = vi.fn().mockResolvedValue({
  id: "product-id",
  name: "Test Product",
  body: "Test Body",
  spec: "Test Spec",
});

vi.mock("@/actions/domain/product", () => ({
  update: (...args: unknown[]) => mockUpdate(...args),
  remove: (...args: unknown[]) => mockRemove(...args),
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: vi.fn(),
  }),
}));

describe("ProductForm", () => {
  const defaultProduct = {
    id: "product-id",
    name: "Test Product",
    body: "Test Body",
    spec: "Test Spec",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form with product data", () => {
    const product = defaultProduct;

    render(<ProductForm product={product} />);

    expect(screen.getByLabelText("Name")).toHaveValue("Test Product");
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });

  it("updates input value when user types", async () => {
    const user = userEvent.setup();
    const product = defaultProduct;

    render(<ProductForm product={product} />);

    const input = screen.getByLabelText("Name");
    await user.clear(input);
    await user.type(input, "Updated Test Product");

    expect(input).toHaveValue("Updated Test Product");
  });

  it("calls update action when Submit button is clicked", async () => {
    const user = userEvent.setup();
    const product = defaultProduct;

    render(<ProductForm product={product} />);

    const inputName = screen.getByLabelText("Name");
    const inputBody = screen.getByLabelText("Body");
    const inputSpec = screen.getByLabelText("Spec");
    await user.clear(inputName);
    await user.type(inputName, "Updated Test Product");
    await user.clear(inputBody);
    await user.type(inputBody, "Updated Test Body");
    await user.clear(inputSpec);
    await user.type(inputSpec, "Updated Test Spec");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({
        id: "product-id",
        data: {
          name: "Updated Test Product",
          body: "Updated Test Body",
          spec: "Updated Test Spec",
        },
      });
    });
  });

  it("calls remove action when Remove button is clicked", async () => {
    const user = userEvent.setup();
    const product = defaultProduct;

    render(<ProductForm product={product} />);

    await user.click(screen.getByRole("button", { name: "Remove" }));

    await waitFor(() => {
      expect(mockRemove).toHaveBeenCalledWith({ id: "product-id" });
    });
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/products");
    });
  });

  it("shows validation error", async () => {
    const user = userEvent.setup();
    const product = defaultProduct;

    render(<ProductForm product={product} />);

    const input = screen.getByLabelText("Name");
    await user.clear(input);
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });
});
