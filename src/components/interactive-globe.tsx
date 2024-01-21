"use client";
import Globe from "react-globe.gl";
import { useState, useEffect, useRef, memo } from "react";
import GlowOrb from "/public/glow.png";
import { api } from "~/trpc/react";

export const InteractiveGlobe = () => {
  const markerSvg = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 14.0426C11.1134 14.0426 14.0426 11.1134 14.0426 7.5C14.0426 3.88665 11.1134 0.957447 7.5 0.957447C3.88665 0.957447 0.957447 3.88665 0.957447 7.5C0.957447 11.1134 3.88665 14.0426 7.5 14.0426ZM7.5 15C11.6421 15 15 11.6421 15 7.5C15 3.35786 11.6421 0 7.5 0C3.35786 0 0 3.35786 0 7.5C0 11.6421 3.35786 15 7.5 15Z" fill="#398AE9"/>
  <path d="M11.8085 7.5C11.8085 9.87952 9.87952 11.8085 7.5 11.8085C5.12048 11.8085 3.19149 9.87952 3.19149 7.5C3.19149 5.12048 5.12048 3.19149 7.5 3.19149C9.87952 3.19149 11.8085 5.12048 11.8085 7.5Z" fill="#398AE9"/>
  </svg>   
  `;

  // Gen random data
  // const N = 30;
  // const gData = [...Array(N).keys()].map(() => ({
  //   lat: (Math.random() - 0.5) * 180,
  //   lng: (Math.random() - 0.5) * 360,
  //   size: 7 + Math.random() * 30,
  //   color: "#398AE9",
  // }));
  // console.log(gData);

  const globeEl = useRef();
  const {
    data: memories = [],
    isError,
    isLoading,
  } = api.memory.publicGetAll.useQuery();

  const gData = memories.map((lat) => ({
    lat: lat.lat,
    lng: lat.long,
    size: 7 + Math.random() * 30,
    color: "#398AE9",
  }));
  console.log(gData);

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
          const el = document.createElement("div");
          el.innerHTML = markerSvg;
          el.style.color = d.color;
          el.style.width = `${d.size}px`;

          el.style["pointer-events"] = "auto";
          el.style.cursor = "pointer";

          const hoverEl = document.createElement("div");
          hoverEl.textContent = "hello";

          el.onclick = () => console.info(d);
          el.onmouseenter = () => el.appendChild(hoverEl);
          el.onmouseleave = () => el.removeChild(hoverEl);
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
