import { NextResponse } from "next/server";
import Stripe from "stripe";

import * as subscriptionService from "@/services/domain/subscription";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-01-28.clover",
});

function extractSubscriptionDates(sub: Stripe.Subscription) {
  const srcPeriodEnterDate = sub.start_date;
  const srcPeriodLeaveDate = sub.items.data[0]?.current_period_end;
  const srcAccessLeaveDate = sub.ended_at ?? sub.cancel_at;

  const periodEnterDate = new Date(srcPeriodEnterDate * 1000);

  const periodLeaveDate = srcPeriodLeaveDate
    ? new Date(srcPeriodLeaveDate * 1000)
    : null;

  const accessLeaveDate = srcAccessLeaveDate
    ? new Date(srcAccessLeaveDate * 1000)
    : null;

  return { periodEnterDate, periodLeaveDate, accessLeaveDate };
}

export async function POST(request: Request) {
  if (STRIPE_WEBHOOK_SECRET == null) {
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }

  const sign = request.headers.get("stripe-signature");

  if (sign == null) {
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }

  try {
    const body = await request.arrayBuffer();
    const buff = Buffer.from(body);

    const event = stripe.webhooks.constructEvent(
      buff,
      sign,
      STRIPE_WEBHOOK_SECRET,
    );

    console.log(event);

    if (event.type === "checkout.session.completed") {
      const userId = event.data.object.client_reference_id;
      const stripeCustomerId = event.data.object.customer?.toString();
      const stripeSubscriptionId = event.data.object.subscription?.toString();

      if (
        userId == null ||
        stripeCustomerId == null ||
        stripeSubscriptionId == null
      ) {
        console.error(event.data.object);
        throw new Error("Invalid event data");
      }

      const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
      const { periodEnterDate, periodLeaveDate, accessLeaveDate } =
        extractSubscriptionDates(sub);

      await subscriptionService.upsert({
        userId,
        stripeCustomerId,
        stripeSubscriptionId,
        status: sub.status,
        periodEnterDate,
        periodLeaveDate,
        accessLeaveDate,
      });
    } else if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const sub = event.data.object;
      const { periodEnterDate, periodLeaveDate, accessLeaveDate } =
        extractSubscriptionDates(sub);

      await subscriptionService.updateByStripeSubscriptionId({
        stripeSubscriptionId: sub.id,
        status: sub.status,
        periodEnterDate,
        periodLeaveDate,
        accessLeaveDate,
      });
    } else {
      console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    const message = `${(error as Error).message}`;

    console.error(message);

    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }

  return NextResponse.json({ message: "Success" }, { status: 200 });
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = "force-no-store";
