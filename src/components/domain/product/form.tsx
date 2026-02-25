"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
  const handleRemove = async () => {
    if (product?.id == null) return;

    const result = await productAction.remove({
      id: product.id,
    });

    console.log("Product removed:", result);
  };

  const handleSubmit = async ({
    data,
  }: {
    data: productSchema.updateSchema;
  }) => {
    const result = await productAction.update({
      id: product.id,
      data: {
        name: data.name,
      },
    });

    console.log("Product updated:", result);

    form.reset({}, { keepValues: true });
  };

  const form = useForm<productSchema.updateSchema>({
    resolver: zodResolver(productSchema.updateZodSchema),
    defaultValues: {
      name: product?.name ?? "",
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
          <Button
            type="submit"
            className="w-full"
            data-testid="product-submit-button"
          >
            Submit
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
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
