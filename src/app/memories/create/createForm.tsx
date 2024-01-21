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
  position: z.object({
    long: z.number(),
    lat: z.number(),
  }),
  pov: z.object({
    pitch: z.number(),
    heading: z.number(),
  }),
  zoom: z.object({
    fov: z.number(),
    zoom: z.number(),
  }),
});

const createFormSchema = z.object({
  title: z.string().min(1, {
    message: "Title must be at least 1 characters.",
  }),
  description: z.string().min(1, {
    message: "Description must be at least 1 characters.",
  }),
});
export type MapMemoryPosition = {
  long: number | undefined;
  lat: number | undefined;
};
export type MapMemoryPov = {
  pitch: number | undefined;
  heading: number | undefined;
};
export type MapMemoryZoom = {
  fov: number | undefined;
  zoom: number | undefined;
};
export type MapMemoryData = {
  position: MapMemoryPosition | undefined;
  pov: MapMemoryPov | undefined;
  zoom: MapMemoryZoom | undefined;
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

  const mapMemoryDataRef = useRef<MapMemoryData>({
    position: undefined,
    pov: undefined,
    zoom: undefined,
  });
  const updateMemoryPosition = (data: MapMemoryPosition) => {
    if (!mapMemoryDataRef.current) {
      return;
    }
    mapMemoryDataRef.current.position = data;
  };
  const updateMemoryZoom = (data: MapMemoryZoom) => {
    if (!mapMemoryDataRef.current) {
      return;
    }
    mapMemoryDataRef.current.zoom = data;
  };
  const updateMemoryPov = (data: MapMemoryPov) => {
    if (!mapMemoryDataRef.current) {
      return;
    }
    mapMemoryDataRef.current.pov = data;
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
      toast("Please find a steet view location", {
        cancel: { label: "close" },
      });
      return;
    }
    mutation.mutate({
      ...values,
      ...res.data.position,
      ...res.data.pov,
      ...res.data.zoom,
    });
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
        <Map
          updateMemoryPosition={updateMemoryPosition}
          updateMemoryPov={updateMemoryPov}
          updateMemoryZoom={updateMemoryZoom}
        />
        <Button>Submit</Button>
      </form>
    </Form>
  );
}
