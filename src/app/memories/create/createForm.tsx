"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Loader } from "@googlemaps/js-api-loader";

const Map = dynamic(() => import("./Map").then((r) => r.default), {
  ssr: false,
});

const mapMemorySchema = z.object({
  long: z.number(),
  lat: z.number(),
  pitch: z.number(),
  fov: z.number(),
  heading: z.number(),
  zoom: z.number(),
});

const createFormSchema = z.object({
  title: z.string().min(1, {
    message: "Title must be at least 1 characters.",
  }),
  description: z.string().min(1, {
    message: "Description must be at least 1 characters.",
  }),
});

export type MapMemoryData = {
  long: number | undefined;
  lat: number | undefined;
  pitch: number | undefined;
  heading: number | undefined;
  fov: number | undefined;
  zoom: number | undefined;
};

export default function CreateForm() {
  const [searchValue, setSearchValue] = useState("");

  const loader = new Loader({
    apiKey: "AIzaSyALnd9Vz1KNL9vGgRYnlL_lyB9yQRqyzVI", // Replace with your API key
    version: "weekly",
  });

  const onSearchClicked = () => {
    // Use the searchValue as needed
    console.log("Search value:", searchValue);

    const placesApiUrl = (place: string) =>
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${place}&key=AIzaSyALnd9Vz1KNL9vGgRYnlL_lyB9yQRqyzVI`;

    fetch(placesApiUrl(searchValue), {
      method: "GET",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      }    
    }).then((response) => response.json())
      .then((data) => {
        const results = data.results;
        const status = data.status;

        if (status !== "OK" || !results) {
          console.error(`Error fetching places for ${searchValue}`);
          return;
        }

        if (results.length === 0) {
          console.error(`No places found based on searchValue: ${searchValue}`);
          return;
        }

        // Handle the results
        console.log("Results:", results);
      })
      .catch((error) => {
        console.error("Error fetching places:", error);
      });
  };
  const mapMemoryDataRef = useRef<MapMemoryData>();
  const updateMemoryData = (data: MapMemoryData) => {
    mapMemoryDataRef.current = data;
  };
  const form = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  const router = useRouter();
  const mutation = api.memory.create.useMutation({
    onSuccess({ id }) {
      router.push(`/memories/${id}`);
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof createFormSchema>) {
    const res = mapMemorySchema.safeParse(mapMemoryDataRef.current);
    if (!res.success) {
      console.log(mapMemoryDataRef.current);
      toast("Please find a steet view location", {
        cancel: { label: "close" },
      });
      return;
    }
    mutation.mutate({ ...values, ...res.data });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex max-w-3xl flex-col gap-4 rounded-lg border-2 border-border p-4"
      >
        <h1 className="text-4xl">Create a memory</h1>
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

        <FormItem>
          <FormLabel>Place</FormLabel>
          <div className="flex space-x-2">
            <Input
              placeholder="Insert place to help specify the location"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button onClick={onSearchClicked}>Search</Button>
          </div>
        </FormItem>

        <Map updateMemoryData={updateMemoryData} />
        <Button>Submit</Button>
      </form>
    </Form>
  );
}
