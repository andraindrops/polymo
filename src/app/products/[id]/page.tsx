import * as productAction from "@/actions/domain/product";

import ProductForm from "@/components/domain/product/form";

import SubscriptionGuard from "@/components/shared/subscriptionGuard";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await productAction.findById({
    id,
  });

  return (
    <>
      <SubscriptionGuard />
      <ProductForm product={product} />
    </>
  );
}

export const dynamic = "force-dynamic";
