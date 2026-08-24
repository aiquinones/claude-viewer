interface LoadDotProps {
  x: number;
  y: number;
}

// A skill's body entering the context, marked on the curve itself rather than as a tick under the
// axis — the spike and the load that caused it are then the same place on the chart instead of two
// things you line up by eye.
//
// The halo is what makes it read as a marker and not as a data point. It pulses, so a dot sitting on
// a flat stretch of curve still catches the eye; the core carries a ring in the panel background so
// it separates from the line it's on.
export const LoadDot = ({ x, y }: LoadDotProps) => (
  <g>
    <circle className="chart-load-halo" cx={x} cy={y} r={5} />
    <circle className="chart-load-core" cx={x} cy={y} r={2.75} />
  </g>
);
