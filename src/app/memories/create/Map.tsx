import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export default function Map() {
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyALnd9Vz1KNL9vGgRYnlL_lyB9yQRqyzVI",
      version: "weekly",
      // ...additionalOptions,
    });
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loader.load().then(async () => {
      const { Map } = (await google.maps.importLibrary(
        "maps",
      )) as google.maps.MapsLibrary;
      mapRef.current = new Map(document.getElementById("map") as HTMLElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
    });
  }, []);

  return (
    <>
      <div className="">
        <div id="map" className="h-[400px] w-full"></div>
        <button
          onClick={() => {
            console.log(mapRef?.current?.getCenter());
            console.log(mapRef?.current?.getStreetView());
          }}
        >
          test
        </button>
      </div>
    </>
  );
}
