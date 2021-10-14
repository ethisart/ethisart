export default function TestPage() {
  const times = Array.from(Array(1000));

  return (
    <main className="grid grid-cols-8">
      {times.map((_, i) => {

        const c1 = Color.random(0, 359, 100, 100, 50, 100);
        const c2 = Color.random(c1.h - 30,
          c1.h - 40,
          100,
          100,
          50,
          100
        );
        const bg = Color.random(200,
          350,
          60,
          90,
          0,
          10
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
              d="M1024.7,813l-474.3,216.9l474.4,281.8l474.1-281.8L1024.7,813z"
              fill={`url(#paint0_linear${i})`}
            />
            <path
              d="M1495.6,1030l-470.9,279.9L553.6,1030l471.1-215.4L1495.6,1030z"
            />
          </g>
        </g>
        <g opacity="1">
          <path
            opacity="0.5"
            d="M1024.7,243.8V1309l-473.4-279.7L1024.7,243.8z"
            fill={`url(#paint1_linear${i})`}
          />
        </g>
        <g opacity="1">
          <path
            opacity="0.8"
            d="M1025.6,1309.1V243.8l473.2,785.5L1025.6,1309.1z"
            fill={`url(#paint2_linear${i})`}
          />
        </g>
        <g>
          <g opacity="0.9">
            <path
              opacity="0.45"
              d="M1024.7,1402.9v384.6l-470.2-662.4L1024.7,1402.9z"
              fill={`url(#paint3_linear${i})`}
            />
          </g>
          <g opacity="0.8">
            <path
              opacity="0.8"
              d="M1496,1125.2l-470.4,662.4v-384.6L1496,1125.2z"
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
          <stop offset="1" stop-color={color2} />
        </linearGradient>
        <linearGradient
          id={`paint2_linear${i}`}
          x1="1262.52"
          y1="238.446"
          x2="1262.52"
          y2="1311.67"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color={color1} />
          <stop offset="1" stop-color={color2} />
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
          <stop offset="1" stop-color={color2} />
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

function ETH2({ color1, color2, bg, i }) {
  return (
    <svg width="2048" height="2048" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path fill={color1} d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" /><path fill={color2} d="M127.962 0L0 212.32l127.962 75.639V154.158z" /><path fill={color1} d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" /><path fill={color1} d="M127.962 416.905v-104.72L0 236.585z" /><path fill={color2} d="M127.961 287.958l127.96-75.637-127.96-58.162z" /><path fill={color1} d="M0 212.32l127.96 75.638v-133.8z" /></svg>
  );
}