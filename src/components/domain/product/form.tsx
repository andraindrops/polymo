"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";

import * as productSchema from "@/schemas/domain/product";

import * as productAction from "@/actions/domain/product";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function Component({
  product,
  className,
  ...props
}: {
  product: productSchema.entitySchema;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();

  const handleRemove = async () => {
    if (product?.id == null) return;

    const result = await productAction.remove({
      id: product.id,
    });

    console.log("Product removed:", result);

    router.push("/products");
  };

  const handleSubmit = async ({
    data,
  }: {
    data: productSchema.createSchema;
  }) => {
    const result = await productAction.update({
      id: product.id,
      data: {
        name: data.name,
        body: data.body,
        spec: data.spec,
      },
    });

    console.log("Product updated:", result);

    form.reset({}, { keepValues: true });
  };

  const form = useForm<productSchema.createSchema>({
    resolver: zodResolver(productSchema.createZodSchema),
    defaultValues: {
      name: product?.name ?? "",
      body: product?.body ?? "",
      spec: product?.spec ?? "",
    },
  });

  return (
    <div className={cn(className)} {...props}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            await handleSubmit({
              data,
            });
          })}
          className="space-y-2"
          data-testid="product-form"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-full"
                    data-testid="product-name-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-full"
                    data-testid="product-body-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="spec"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spec</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-full"
                    data-testid="product-spec-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            data-testid="product-submit-button"
          >
            Submit
          </Button>
          <Button
            type="button"
            className="w-full"
            onClick={handleRemove}
            data-testid="product-remove-button"
          >
            Remove
          </Button>
        </form>
      </Form>
    </div>
  );
}
