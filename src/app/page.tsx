import { auth } from "@clerk/nextjs/server";
import { Check, Mail } from "lucide-react";

import * as subscriptionService from "@/services/domain/subscription";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import StudioForm from "@/components/domain/product/studio/form";

import SubscriptionGuard from "@/components/shared/subscriptionGuard";

const FAQ_ITEMS = [
  {
    question: "What is Polymo good at?",
    answer:
      "It allows you to create web app prototypes quickly, just like using a photo booth. Polymo is designed to build simple and stable prototypes using templates and clear rules. If you want to develop your project further, you can use it with other AI coding tools later. It is made for testing quick ideas, not for long-term product dev and ops.",
  },
  {
    question: "What is a single-page HTML web app?",
    answer:
      "It creates a web app using only one HTML file. It uses technologies like TypeScript, React, Zod, Tailwind CSS, React Hook Form, and Wouter.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "We accept refund requests for the current month for any reason. Please contact us at dev@andraindrops.dev.",
  },
];

const PLAN_FEATURES = [
  "Unlimited apps",
  "Refund requests for the current month for any reason",
];

export default async function Page() {
  const { userId } = await auth();

  if (userId == null) {
    return (
      <>
        <section className="mx-auto max-w-md px-8 py-16">
          <StudioForm isAuthenticated={false} />
        </section>
        <div className="bg-[#25343F] text-white">
          <div className="mx-auto max-w-md space-y-16 px-8 py-16">
            <HiSection />
            <PricingSection />
            <FaqSection />
            <ContactSection />
          </div>
        </div>
      </>
    );
  } else {
    const subscription = await subscriptionService.findActiveByUserId({
      userId,
    });

    return (
      <>
        <SubscriptionGuard />
        <section className="mx-auto max-w-md px-8 py-16">
          <StudioForm hasSubscription={subscription != null} />
        </section>
        <div className="bg-[#25343F] text-white">
          <div className="mx-auto max-w-md space-y-16 px-8 py-16">
            <HiSection />
            <PricingSection />
            <FaqSection />
            <ContactSection />
          </div>
        </div>
      </>
    );
  }
}

function HiSection() {
  return (
    <section className="space-y-4">
      <h2 className="font-bold text-2xl">Hi</h2>
      <p className="text-justify text-white/80 leading-relaxed">
        Polymo - Build single-page HTML web apps with a simple and stable
        boilerplate.
      </p>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="space-y-4">
      <h2 className="font-bold text-2xl">Pricing</h2>
      <Card className="bg-white text-[#25343F]">
        <CardHeader>
          <CardTitle className="text-center">
            <div className="font-bold text-4xl">$20</div>
            <div className="text-[#25343F]/60 text-sm">/month</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="space-y-2 text-sm">
            {PLAN_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="size-4 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          <Button className="w-full bg-[#25343F] text-white hover:bg-[#25343F]/90">
            Get Started
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="space-y-4">
      <h2 className="font-bold text-2xl">Contact</h2>
      <a
        href="mailto:dev@andraindrops.dev"
        className="flex items-center gap-2 text-white/80 hover:text-white"
      >
        <Mail className="size-4 shrink-0" />
        dev@andraindrops.dev
      </a>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="space-y-4">
      <h2 className="font-bold text-2xl">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible>
        {FAQ_ITEMS.map((item, index) => (
          <AccordionItem
            key={item.question}
            value={`item-${index}`}
            className="border-white/20 text-justify"
          >
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
