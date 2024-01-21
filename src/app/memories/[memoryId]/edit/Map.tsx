import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import {
  MapMemoryData,
  MapMemoryPosition,
  MapMemoryPov,
  MapMemoryZoom,
} from "./createForm";
import { env } from "~/env";
import { RouterOutputs } from "~/trpc/shared";

export default function Map({
  memory,
  updateMemoryPov,
  updateMemoryZoom,
  updateMemoryPosition,
}: {
  updateMemoryPov: (data: MapMemoryPov) => void;
  updateMemoryZoom: (data: MapMemoryZoom) => void;
  updateMemoryPosition: (data: MapMemoryPosition) => void;
  memory: NonNullable<RouterOutputs["memory"]["getById"]>;
}) {
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
      version: "weekly",
      // ...additionalOptions,
    });
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loader
      .load()
      .then(async () => {
        const { Map } = (await google.maps.importLibrary(
          "maps",
        )) as google.maps.MapsLibrary;
        mapRef.current = new Map(
          document.getElementById("map") as HTMLElement,
          {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
          },
        );
      })
      .then(() => {
        if (!mapRef.current) throw Error("Cant get map reference");
        mapRef.current.getStreetView().setVisible(true);
        mapRef.current
          .getStreetView()
          .setPov({ heading: memory.heading, pitch: memory.pitch });
        mapRef.current.getStreetView().setPosition({
          lat: memory.lat,
          lng: memory.long,
        });
        mapRef.current.getStreetView().setZoom(memory.zoom);

        mapRef.current.getStreetView().addListener("position_changed", () => {
          // console.log("position_changed");
          updateMemoryPosition({
            long: mapRef.current?.getStreetView().getLocation()?.latLng?.lng(),
            lat: mapRef.current?.getStreetView().getLocation()?.latLng?.lat(),
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

  return (
    <>
      <div className="">
        <div id="map" className="h-[400px] w-full"></div>
      </div>
    </>
  );
}