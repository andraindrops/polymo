"use client";

import {
  EllipsisVerticalIcon,
  PackageIcon,
  ReceiptTextIcon,
  SquarePenIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type * as productSchema from "@/schemas/domain/product";

import * as productAction from "@/actions/domain/product";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ProductForm from "@/components/domain/product/form";

export default function Component() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState<productSchema.entitySchema[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<productSchema.entitySchema | null>(null);

  const handleCreate = () => {
    startTransition(async () => {
      const product = await productAction.create({
        data: {
          name: "Untitled",
        },
      });
      router.push(`/products/${product.id}/studio`);
    });
  };

  const handleDropdownOpenChange = ({ open }: { open: boolean }) => {
    setDropdownOpen(open);
    if (open) {
      productAction.findMany().then(setProducts);
    }
  };

  const handleEditOpen = ({
    product,
  }: {
    product: productSchema.entitySchema;
  }) => {
    setDropdownOpen(false);
    setEditingProduct(product);
  };

  const handleEditClose = () => {
    setEditingProduct(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleCreate}
        disabled={isPending}
        className="cursor-pointer opacity-80 hover:opacity-100 disabled:cursor-wait disabled:opacity-40"
      >
        <SquarePenIcon size={20} />
      </button>
      <DropdownMenu
        open={dropdownOpen}
        onOpenChange={(open) => handleDropdownOpenChange({ open })}
      >
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="cursor-pointer opacity-80 hover:opacity-100"
          >
            <PackageIcon size={20} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {products.length <= 0 ? (
            <DropdownMenuItem disabled>No products</DropdownMenuItem>
          ) : (
            products.map((product) => (
              <div key={product.id} className="flex items-center">
                <DropdownMenuItem asChild className="flex-1">
                  <Link href={`/products/${product.id}/studio`}>
                    {product.name}
                  </Link>
                </DropdownMenuItem>
                <button
                  type="button"
                  onClick={() => handleEditOpen({ product })}
                  className="cursor-pointer px-2 opacity-60 hover:opacity-100"
                >
                  <EllipsisVerticalIcon size={16} />
                </button>
              </div>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {process.env.NEXT_PUBLIC_STRIPE_SETTING_URL != null && (
        <a
          href={process.env.NEXT_PUBLIC_STRIPE_SETTING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer opacity-80 hover:opacity-100"
        >
          <ReceiptTextIcon size={20} />
        </a>
      )}
      <Dialog
        open={editingProduct != null}
        onOpenChange={(open) => {
          if (!open) handleEditClose();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct != null && <ProductForm product={editingProduct} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
