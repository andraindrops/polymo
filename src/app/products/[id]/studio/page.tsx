import * as productAction from "@/actions/domain/product";

import StudioForm from "@/components/domain/product/studio/form";

import SubscriptionGuard from "@/components/shared/subscriptionGuard";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string }>;
}) {
  const { id } = await params;
  const { message } = await searchParams;

  const product = await productAction.findById({
    id,
  });

  return (
    <div className="mx-auto max-w-md px-8">
      <SubscriptionGuard />
      <StudioForm productId={product.id} initialMessage={message} />
    </div>
  );
}

export const dynamic = "force-dynamic";
