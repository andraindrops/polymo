"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";

import * as exampleSchema from "@/schemas/domain/example";

import * as exampleAction from "@/actions/domain/example";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function Component({
  example,
  className,
  ...props
}: {
  example: exampleSchema.entitySchema;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();

  const handleRemove = async () => {
    if (example?.id == null) return;

    const result = await exampleAction.remove({
      id: example.id,
    });

    console.log("Example removed:", result);

    router.push("/examples");
  };

  const handleSubmit = async ({
    data,
  }: {
    data: exampleSchema.createSchema;
  }) => {
    const result = await exampleAction.update({
      id: example.id,
      data: {
        name: data.name,
      },
    });

    console.log("Example updated:", result);

    form.reset({}, { keepValues: true });
  };

  const form = useForm<exampleSchema.createSchema>({
    resolver: zodResolver(exampleSchema.createZodSchema),
    defaultValues: {
      name: example?.name ?? "",
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
          data-testid="example-form"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="w-full"
                    data-testid="example-name-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            data-testid="example-submit-button"
          >
            Submit
          </Button>
          <Button
            type="button"
            className="w-full"
            onClick={handleRemove}
            data-testid="example-remove-button"
          >
            Remove
          </Button>
        </form>
      </Form>
    </div>
  );
}
