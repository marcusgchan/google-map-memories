import { MutableRefObject, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import {
  MapMemoryData,
  MapMemoryPosition,
  MapMemoryPov,
  MapMemoryZoom,
} from "./createForm";
import { env } from "~/env";

export default function Map({
  updateMemoryPov,
  updateMemoryZoom,
  updateMemoryPosition,
  mapRef
}: {
  updateMemoryPov: (data: MapMemoryPov) => void;
  updateMemoryZoom: (data: MapMemoryZoom) => void;
  updateMemoryPosition: (data: MapMemoryPosition) => void
  mapRef: MutableRefObject<google.maps.Map | null>
}) {

  useEffect(() => {
    const loader = new Loader({
      apiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
      version: "weekly",
      libraries: ["places"],
      // ...additionalOptions,
    });
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loader
      .load()
      .then(() => {
        if (!mapRef.current) throw Error("Cant get map reference");
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

  return (
    <>
      <div className="">
        <div id="map" className="h-[400px] w-full"></div>
      </div>
    </>
  );
}
