import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ProductList from "@/components/domain/product/list";

vi.mock("@/actions/domain/product", () => ({
  create: vi.fn().mockResolvedValue({
    id: "product-id",
    name: "Untitled",
    body: "",
    spec: "",
  }),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("ProductList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty state when no products provided", () => {
    const products: { id: string; name: string; body: string; spec: string }[] =
      [];

    render(<ProductList products={products} />);

    expect(screen.getByText("Create one to get started.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("renders list of products", () => {
    const products = [
      {
        id: "product-1-id",
        name: "Test Product 1",
        body: "Body 1",
        spec: "Spec 1",
      },
      {
        id: "product-2-id",
        name: "Test Product 2",
        body: "Body 2",
        spec: "Spec 2",
      },
    ];

    render(<ProductList products={products} />);

    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("Test Product 2")).toBeInTheDocument();
    expect(
      screen.queryByText("Create one to get started."),
    ).not.toBeInTheDocument();
  });

  it("renders links to product detail pages", () => {
    const products = [
      { id: "product-id", name: "Test Product", body: "Body", spec: "Spec" },
    ];

    render(<ProductList products={products} />);

    const link = screen.getByRole("link", { name: "Test Product" });
    expect(link).toHaveAttribute("href", "/products/product-id");
  });

  it("calls create action when Create button is clicked", async () => {
    const user = userEvent.setup();
    const { create } = await import("@/actions/domain/product");
    const products: { id: string; name: string; body: string; spec: string }[] =
      [];

    render(<ProductList products={products} />);

    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(create).toHaveBeenCalledWith({
        data: { name: "Untitled", body: "", spec: "" },
      });
    });
  });
});
