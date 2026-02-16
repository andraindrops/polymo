"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

import type * as productSchema from "@/schemas/domain/product.ts";

import * as productAction from "@/actions/domain/product";

import { Button } from "@/components/ui/button";

export default function Component({
  products,
  className,
  ...props
}: {
  products: productSchema.entitySchema[];
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const handleCreate = async () => {
    await productAction.create({
      data: {
        name: "Untitled",
        body: "",
        spec: "",
      },
    });
  };

  return (
    <div className={cn(className)} {...props}>
      <div className="space-y-8">
        <Button
          onClick={handleCreate}
          className="w-full"
          data-testid="product-create-button"
        >
          Create
        </Button>
        {products.length <= 0 ? (
          <div
            className="text-center text-muted-foreground"
            data-testid="product-empty-state"
          >
            Create one to get started.
          </div>
        ) : (
          <div className="space-y-4" data-testid="product-list">
            {products.map((product) => {
              return (
                <div key={product.id} data-testid="product-list-item">
                  <Link href={`/products/${product.id}`}>
                    <div>{product.name}</div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
