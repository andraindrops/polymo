"use client";

import { SquarePenIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import * as productAction from "@/actions/domain/product";

export default function Component() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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

  return (
    <button
      type="button"
      data-testid="product-studio-create-button"
      onClick={handleCreate}
      disabled={isPending}
      className="cursor-pointer opacity-80 hover:opacity-100 disabled:cursor-wait disabled:opacity-40"
    >
      <SquarePenIcon size={20} />
    </button>
  );
}
