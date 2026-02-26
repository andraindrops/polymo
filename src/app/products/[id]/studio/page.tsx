import * as productAction from "@/actions/domain/product";

import StudioForm from "@/components/domain/product/studio/form";

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
    <div className="mx-auto max-w-md px-8">
      <SubscriptionGuard />
      <StudioForm productId={product.id} />
    </div>
  );
}

export const dynamic = "force-dynamic";
