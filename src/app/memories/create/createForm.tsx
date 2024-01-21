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
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader } from "@googlemaps/js-api-loader";
import { env } from "~/env";

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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const center = { lat: 50.064192, lng: -130.605469 };

  useEffect(() => {
    const loader = new Loader({
      apiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
      version: "weekly",
      libraries: ["places"],
      // ...additionalOptions,
    });
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loader.load().then(async () => {
      const { Map } = (await google.maps.importLibrary(
        "maps",
      )) as google.maps.MapsLibrary;
      mapRef.current = new Map(
        document.getElementById("map") as HTMLElement,
        {
          center: center,
          zoom: 8,
        },
      );

      mapRef.current.getStreetView().setVisible(true);
      mapRef.current.getStreetView().setVisible(false);

      mapRef.current.getStreetView().addListener("position_changed", () => {
        // console.log("position_changed");
        updateMemoryPosition({
          long: mapRef.current?.getCenter()?.lng(),
          lat: mapRef.current?.getCenter()?.lat(),
        });
      });
      mapRef.current.getStreetView().addListener("zoom_changed", () => {
        // console.log("zoom_changed");
        updateMemoryZoom({
          zoom: mapRef.current?.getStreetView().getZoom(),
          fov:
            180 / Math.pow(2, mapRef.current?.getStreetView().getZoom() ?? 1),
        });
      });
      mapRef.current.getStreetView().addListener("pov_changed", () => {
        // console.log("pov_changed");
        updateMemoryPov({
          pitch: mapRef.current?.getStreetView().getPov().pitch,
          heading: mapRef.current?.getStreetView().getPov().heading,
        });
      });
 
    });
  }, []);

  const onSearchChange = () => {
    // Create a bounding box with sides ~10km away from the center point
    const defaultBounds = {
      north: center.lat + 0.1,
      south: center.lat - 0.1,
      east: center.lng + 0.1,
      west: center.lng - 0.1,
    };

    const options = {
      bounds: defaultBounds,
      fields: ["address_components", "geometry", "icon", "name"],
      strictBounds: false,
    };

    const autocomplete = new google.maps.places.Autocomplete(
      inputRef.current,
      options,
    );
  };

  const onSearchClicked = async () => {

    if (!mapRef.current) {
      return;
    }
    // const { Map } = (await google.maps.importLibrary(
    //   "maps",
    // )) as google.maps.MapsLibrary;
    
    const placesService = new google.maps.places.PlacesService(mapRef.current);
    
    const request = {
      query: inputRef.current?.value
    };
    
    placesService.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const location = results?.[0]?.geometry?.location

        const lat = location?.lat()
        const lng = location?.lng()

        if (!mapRef.current) {
          return;
        }

        mapRef.current.setCenter(new google.maps.LatLng(lat || center.lat, lng || center.lng))
      } else {
        console.error('Error in textSearch:', status);
      }
    });
  }

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

    console.log("result", res)
    if (!res.success) {
      toast("Please find a street view location", {
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
              ref={inputRef}
              onChange={onSearchChange}
              placeholder="Insert place to help specify the location"
            />
            <Button onClick={onSearchClicked} type="button">
              Search
            </Button>
          </div>
        </FormItem>
        <div className="">
        <div id="map" className="h-[400px] w-full"></div>
      </div>
        <Button>Submit</Button>
      </form>
    </Form>
  );
}
