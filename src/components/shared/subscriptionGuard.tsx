import * as authService from "@/services/shared/auth";

import * as subscriptionService from "@/services/domain/subscription";

import PaymentModal from "@/components/shared/paymentModal";

export default async function SubscriptionGuard() {
  const userId = await authService.getUserId();
  const subscription = await subscriptionService.findActiveByUserId({ userId });

  if (subscription) {
    return null;
  }

  const basePaymentUrl = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_URL;

  if (!basePaymentUrl) {
    return null;
  }

  const paymentUrl = `${basePaymentUrl}?client_reference_id=${userId}`;

  return <PaymentModal paymentUrl={paymentUrl} />;
}
