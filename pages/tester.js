export default function TestPage() {
  const times = Array.from(Array(100));

  return (
    <main className="grid grid-cols-8">
      {times.map((_, i) => {

        const c1 = Color.random(0, 359, 100, 100, 50, 100);
        const c2 = Color.random(c1.h-30,
                                c1.h-40,
                                100,
                                100,
                                50,
                                50
                                );
        const bg = Color.random(160,
                                300,
                                30,
                                40,
                                10,
                                20
                                );
 
        return (
          <div key={i} className="">
            <ETH
              color1={c1.toHSL()}
              color2={c2.toHSL()}
              bg={bg.toHSL()}
              i={i}
            />
          </div>
        );
      })}
    </main>
  );
}

class Color {
  constructor(h, s, l) {
    this.h = h;
    this.s = s;
    this.l = l;
  }

  toHSL() {
    return `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
  }
}

Color.random = function (hMin, hMax, sMin, sMax, lMin, lMax) {
  return new Color(rand(hMin, hMax), rand(sMin, sMax), rand(lMin, lMax));
};

function rand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function ETH({ color1, color2, bg, i }) {
  return (
    <svg
      viewBox="0 0 2048 2048"
      fill="none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="2048"
        height="2048"
        fill={bg}
      />
      <g>
        <g opacity="1">
          <g opacity="0.8" filter="url(#filter0_d)">
            <path
              d="M1024.12 812.954L547.138 1029.85L1024.15 1311.67L1500.92 1029.85L1024.12 812.954Z"
              fill={`url(#paint0_linear${i})`}
            />
            <path
              d="M1497.68 1030.02L1024.15 1309.93L550.38 1030.02L1024.12 814.601L1497.68 1030.02Z"
            />
          </g>
        </g>
        <g opacity="1">
          <path
            opacity="0.5"
            d="M1022.65 243.84V1309.04L549.204 1029.33L1022.65 243.84Z"
            fill={`url(#paint1_linear${i})`}
          />
        </g>
        <g opacity="1">
          <path
            opacity="0.8"
            d="M1025.62 1309.09V243.842L1498.86 1029.33L1025.62 1309.09Z"
            fill={`url(#paint2_linear${i})`}
          />
        </g>
        <g>
          <g opacity="0.9">
            <path
              opacity="0.45"
              d="M1022.65 1402.95V1787.57L552.436 1125.14L1022.65 1402.95Z"
              fill={`url(#paint3_linear${i})`}
            />
          </g>
          <g opacity="0.8">
            <path
              opacity="0.8"
              d="M1496.02 1125.16L1025.62 1787.59V1402.95L1496.02 1125.16Z"
              fill={`url(#paint4_linear${i})`}
            />
          </g>
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d"
          x="397.138"
          y="812.954"
          width="1253.78"
          height="1448.72"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
        <linearGradient
          id={`paint0_linear${i}`}
          x1="1024.03"
          y1="812.954"
          x2="1024.03"
          y2="1311.67"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color={color1} />
          <stop offset="1" stop-color={color2} />
        </linearGradient>
        <linearGradient
          id={`paint1_linear${i}`}
          x1="785.642"
          y1="238.446"
          x2="785.642"
          y2="1311.67"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color={color1} />
          <stop offset="1" stop-color={color2}  />
        </linearGradient>
        <linearGradient
          id={`paint2_linear${i}`}
          x1="1262.52"
          y1="238.446"
          x2="1262.52"
          y2="1311.71"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color={color1} />
          <stop offset="1" stop-color={color2}  />
        </linearGradient>
        <linearGradient
          id={`paint3_linear${i}`}
          x1="785.642"
          y1="1120.27"
          x2="785.642"
          y2="1792.28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color={color1} />
          <stop offset="1" stop-color={color2}  />
        </linearGradient>
        <linearGradient
          id={`paint4_linear${i}`}
          x1="1262.72"
          y1="1120.29"
          x2="1262.72"
          y2="1792.29"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color={color1} />
          <stop offset="1" stop-color={color2} />
        </linearGradient>
      </defs>
    </svg>
  );
}
