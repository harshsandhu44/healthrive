import * as React from "react";
import { SVGProps } from "react";

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={500}
    height={500}
    viewBox="0 0 375 375"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <defs>
      <clipPath id="a">
        <path d="M172 40.578h164v294H172Zm0 0" />
      </clipPath>
      <clipPath id="b">
        <path d="M38 58h125v224H38Zm0 0" />
      </clipPath>
      <clipPath id="c">
        <path d="M67.93 58.46c-2.813 14.13 4.254 28.696 14.422 38.868 10.171 10.172 23.187 16.945 35.617 24.215s24.828 15.535 32.656 27.64c6.8 10.524 9.555 23.13 10.992 35.587 1.73 15.07 1.496 30.925-3.312 45.144-3.489-8.559-8.032-16.77-13.223-24.418-10.172-15.066-22.687-28.375-35.144-41.598-14.57-15.445-29.11-30.894-43.676-46.343 15.066 28.257 38.43 51.007 58.183 76.246 19.758 25.207 36.586 55.312 34.739 87.293-1.465-16.356-14.746-29.344-29.137-37.258-14.395-7.914-30.547-12.309-44.762-20.578-26.851-15.711-44.91-45.492-46.316-76.535-1.407-31.395 12.93-61.235 28.96-88.262m0 0" />
      </clipPath>
      <linearGradient
        id="d"
        x1={-1204.21}
        x2={-1204.21}
        y1={61}
        y2={820.5}
        gradientTransform="matrix(-.29313 0 0 .29313 -252.257 40.58)"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset={0}
          style={{
            stopColor: "#88bf42",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.125}
          style={{
            stopColor: "#88bf42",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.25}
          style={{
            stopColor: "#88be42",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.375}
          style={{
            stopColor: "#87be42",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.5}
          style={{
            stopColor: "#87bd42",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.625}
          style={{
            stopColor: "#86bd42",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.75}
          style={{
            stopColor: "#86bc41",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.875}
          style={{
            stopColor: "#85bb41",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: "#85bb41",
            stopOpacity: 1,
          }}
        />
      </linearGradient>
    </defs>
    <g clipPath="url(#a)">
      <path
        d="M297.336 40.578c3.723 18.645-5.598 37.875-19.024 51.3-13.425 13.454-30.601 22.364-46.988 31.95-16.418 9.586-32.8 20.52-43.09 36.496-8.972 13.895-12.636 30.543-14.511 46.961-2.344 19.93-2.024 40.832 4.308 59.594 4.602-11.317 10.614-22.133 17.442-32.246 13.425-19.903 29.957-37.461 46.402-54.934l57.66-61.176c-19.902 37.286-50.742 67.364-76.8 100.633-26.06 33.301-48.278 73.047-45.848 115.258 1.937-21.601 19.465-38.75 38.488-49.187 19.027-10.434 40.336-16.27 59.066-27.172 35.442-20.637 59.274-59.977 61.122-100.957 1.875-41.45-17.032-80.875-38.227-116.52m0 0"
        style={{
          stroke: "none",
          fillRule: "nonzero",
          fill: "#8cc342",
          fillOpacity: 1,
        }}
      />
    </g>
    <g clipPath="url(#b)">
      <g clipPath="url(#c)">
        <path
          d="M163.348 58.46v222.634H37.562V58.46Zm0 0"
          style={{
            stroke: "none",
            fillRule: "nonzero",
            fill: "url(#d)",
          }}
        />
      </g>
    </g>
  </svg>
);
