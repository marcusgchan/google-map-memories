"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { type RouterOutputs } from "~/trpc/shared";
import { z } from "zod";

type Memory = NonNullable<RouterOutputs["memory"]["getById"]>;
export const editSchema = z.object({
  title: z.string().min(1, {
    message: "Title must be at least 1 characters.",
  }),
  description: z.string().min(1, {
    message: "Description must be at least 1 characters.",
  }),
  streetViewUrl: z.string().url({
    message: "Street view url must be a valid url.",
  }),
});

export function EditMemory({ memory }: { memory: Memory }) {
  const form = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: memory.title,
      description: memory.description,
      streetViewUrl: memory.streetViewUrl,
    },
  });
  const router = useRouter();
  const mutation = api.memory.edit.useMutation({
    onSuccess({ id }) {
      router.push(`/memories/${id}`);
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof editSchema>) {
    mutation.mutate({ id: memory.id, ...values });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex max-w-md flex-col gap-4 rounded-lg border-2 border-border p-4"
      >
        <h1 className="text-4xl">Edit a memory</h1>
        <p>Capture a moment in google maps.</p>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about your memory" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="streetViewUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street View URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="Copy and past the street view URL"
                  {...field}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button>Submit</Button>
      </form>
    </Form>
  );
}
