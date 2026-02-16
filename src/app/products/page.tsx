import * as productAction from "@/actions/domain/product";

import ProductList from "@/components/domain/product/list";

import SubscriptionGuard from "@/components/shared/subscriptionGuard";

export default async function Page() {
  const products = await productAction.findMany();

  return (
    <>
      <SubscriptionGuard />
      <ProductList products={products} />
    </>
  );
}

export const dynamic = "force-dynamic";
