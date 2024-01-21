import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import {
  MapMemoryData,
  MapMemoryPosition,
  MapMemoryPov,
  MapMemoryZoom,
} from "./createForm";

export default function Map({
  updateMemoryPov,
  updateMemoryZoom,
  updateMemoryPosition,
}: {
  updateMemoryPov: (data: MapMemoryPov) => void;
  updateMemoryZoom: (data: MapMemoryZoom) => void;
  updateMemoryPosition: (data: MapMemoryPosition) => void;
}) {
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyALnd9Vz1KNL9vGgRYnlL_lyB9yQRqyzVI",
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
        mapRef.current.getStreetView().setVisible(false);
<<<<<<< HEAD
        mapRef.current.addListener("bounds_changed", () => {
          updateMemoryData({
=======

        mapRef.current.getStreetView().addListener("position_changed", () => {
          console.log("position_changed");
          updateMemoryPosition({
>>>>>>> 4d999d28a917ab5440959ecf1423812da9cb649b
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
        <button
          onClick={() => {
            console.log({
              long: mapRef.current?.getCenter()?.lng(),
              lat: mapRef.current?.getCenter()?.lat(),
              zoom: mapRef.current?.getStreetView().getZoom(),
              pitch: mapRef.current?.getStreetView().getPov(),
              heading: mapRef.current?.getStreetView().getPov().heading,
              fov:
                180 /
                Math.pow(2, mapRef.current?.getStreetView().getZoom() ?? 1),
            });
          }}
        >
          Click me
        </button>
      </div>
    </>
  );
}
