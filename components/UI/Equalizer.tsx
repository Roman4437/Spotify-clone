export default function Equalizer() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ background: "transparent", display: "block", shapeRendering: "auto" }} width="15px" height="15px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
      <g transform="rotate(180 50 50)">
        <rect x="12.666666666666668" y="12.5" width="8" height="40" fill="#1ed760">
          <animate attributeName="height" calcMode="spline" values="50;75;10;50" keyTimes="0;0.33;0.66;1" dur="1.4285714285714284s" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" repeatCount="indefinite" begin="-0.857142857142857s"></animate>
        </rect>
        <rect x="29.333333333333336" y="12.5" width="8" height="40" fill="#1ed760">
          <animate attributeName="height" calcMode="spline" values="50;75;10;50" keyTimes="0;0.33;0.66;1" dur="1.4285714285714284s" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" repeatCount="indefinite" begin="0s"></animate>
        </rect>
        <rect x="46" y="12.5" width="8" height="40" fill="#1ed760">
          <animate attributeName="height" calcMode="spline" values="50;75;10;50" keyTimes="0;0.33;0.66;1" dur="1.4285714285714284s" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" repeatCount="indefinite" begin="-0.2857142857142857s"></animate>
        </rect>
        <rect x="62.66666666666667" y="12.5" width="8" height="40" fill="#1ed760">
          <animate attributeName="height" calcMode="spline" values="50;75;10;50" keyTimes="0;0.33;0.66;1" dur="1.4285714285714284s" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" repeatCount="indefinite" begin="-1.1428571428571428s"></animate>
        </rect>
        <rect x="79.33333333333333" y="12.5" width="8" height="40" fill="#1ed760">
          <animate attributeName="height" calcMode="spline" values="50;75;10;50" keyTimes="0;0.33;0.66;1" dur="1.4285714285714284s" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" repeatCount="indefinite" begin="-0.5714285714285714s"></animate>
        </rect>
      </g>
    </svg>
  )
}