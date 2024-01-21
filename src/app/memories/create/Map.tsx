import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MapMemoryData } from "./createForm";

export default function Map({
  updateMemoryData,
}: {
  updateMemoryData: (data: MapMemoryData) => void;
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

        mapRef.current.addListener("bounds_changed", () => {
          updateMemoryData({
            long: mapRef.current?.getCenter()?.lng(),
            lat: mapRef.current?.getCenter()?.lat(),
            zoom: mapRef.current?.getStreetView().getZoom(),
            pitch: mapRef.current?.getStreetView().getPov().pitch,
            heading: mapRef.current?.getStreetView().getPov().heading,
            fov:
              180 / Math.pow(2, mapRef.current?.getStreetView().getZoom() ?? 1),
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
