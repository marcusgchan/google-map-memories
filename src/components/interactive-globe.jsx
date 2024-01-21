"use client";
import Globe from "react-globe.gl";
import { useState, useEffect, useRef } from "react";
import GlowOrb from "/public/glow.png";
import { api } from "~/trpc/react";

export const InteractiveGlobe = () => {
  const markerSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M10 18.7234C14.8178 18.7234 18.7234 14.8178 18.7234 10C18.7234 5.1822 14.8178 1.2766 10 1.2766C5.1822 1.2766 1.2766 5.1822 1.2766 10C1.2766 14.8178 5.1822 18.7234 10 18.7234ZM10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z" fill="#398AE9"/>
  <path d="M15.7447 10C15.7447 13.1727 13.1727 15.7447 10 15.7447C6.8273 15.7447 4.25532 13.1727 4.25532 10C4.25532 6.8273 6.8273 4.25532 10 4.25532C13.1727 4.25532 15.7447 6.8273 15.7447 10Z" fill="#398AE9"/>
  </svg>   
  `;

  const globeEl = useRef();
  const {
    data: memories = [],
    isError,
    isLoading,
  } = api.memory.publicGetAll.useQuery();

  const gData = memories.map(({ id, title, date, lat, long }) => ({
    id,
    title,
    date,
    lat,
    lng: long,
    size: 7 + Math.random() * 30,
    color: "#398AE9",
  }));

  const [countries, setCountries] = useState({ features: [] });
  useEffect(() => {
    // load data
    const fetchData = async () => {
      try {
        const response = await fetch("countries.geojson");
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({
        altitude: 1.7,
      });
      const controls = globeEl.current.controls();
      controls.enableZoom = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.25;
      controls.update();
    }
  }, [globeEl]);

  return (
    <article>
      <div className="absolute">
        <svg
          width="1504"
          height="1226"
          viewBox="0 0 1504 1226"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_f_7_371)">
            <circle cx="470.5" cy="704.5" r="270.5" fill="#FBCFE8" />
          </g>
          <g filter="url(#filter1_f_7_371)">
            <ellipse
              cx="690.583"
              cy="492.542"
              rx="324.057"
              ry="292.542"
              fill="#F472B6"
            />
          </g>
          <g opacity="0.5" filter="url(#filter2_f_7_371)">
            <ellipse cx="903" cy="721.5" rx="433" ry="304.5" fill="#5EEAD4" />
          </g>
          <defs>
            <filter
              id="filter0_f_7_371"
              x="0"
              y="234"
              width="941"
              height="941"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="100"
                result="effect1_foregroundBlur_7_371"
              />
            </filter>
            <filter
              id="filter1_f_7_371"
              x="166.525"
              y="0"
              width="1048.11"
              height="985.085"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="100"
                result="effect1_foregroundBlur_7_371"
              />
            </filter>
            <filter
              id="filter2_f_7_371"
              x="270"
              y="217"
              width="1266"
              height="1009"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="100"
                result="effect1_foregroundBlur_7_371"
              />
            </filter>
          </defs>
        </svg>
      </div>
      <Globe
        ref={globeEl}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={false}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        hexPolygonsData={countries.features}
        hexPolygonResolution={3}
        hexPolygonMargin={0.3}
        hexPolygonUseDots={true}
        hexPolygonColor={() => "#ffffff"}
        htmlElementsData={gData}
        htmlElement={(d) => {
          const el = document.createElement("a");
          el.style.display = "flex";
          el.innerHTML = markerSvg;
          el.style.color = d.color;
          el.style.width = `${d.size}px`;

          el.style["pointer-events"] = "auto";
          el.style.cursor = "pointer";
          el.href = `/memories/${d.id}`;

          return el;
        }}
      />
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={GlowOrb.src}
          alt="glow orb"
          className=" pointer-events-none absolute inset-0 ml-[23.5%] mr-auto mt-[16%] w-[55%]"
        />
      </div>
    </article>
  );
};
