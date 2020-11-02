import React, { useEffect, useMemo, useRef } from "react";
import styles from "./Trend.style";

interface ITrend {
  points: [number, number][];
  width: number;
  height: number;
}

export default function Trend({ points, width, height }: ITrend) {
  const ref = useRef(null);

  const contentOffset: [number, number] = useMemo(
    () =>
      // [offsetX,offsetY]
      [30, 0],
    []
  );

  const contentSize = useMemo(() => [width - 30, height - 30], [width, height]);

  useEffect(() => {
    const [contentWidth, contentHeight] = contentSize;
    const [offsetX, offsetY] = contentOffset;

    const context: CanvasRenderingContext2D = ref.current.getContext("2d");
    const [minX, maxX, minY, maxY] = points.reduce(
      (prev, current) => [
        Math.min(prev[0], current[0]),
        Math.max(prev[1], current[0]),
        Math.min(prev[2], current[1]),
        Math.max(prev[3], current[1]),
      ],
      [Infinity, -Infinity, Infinity, -Infinity]
    );
    // clear
    context.clearRect(0, 0, width, height);

    // draw axis
    brokenLineTo(context, [
      [(width - contentWidth) / 2, 0],
      [(width - contentWidth) / 2, height],
    ]);
    brokenLineTo(context, [
      [(width - contentWidth) / 2 - 5, 5],
      [(width - contentWidth) / 2, 0],
      [(width - contentWidth) / 2 + 5, 5],
    ]);

    brokenLineTo(context, [
      [0, (height + contentHeight) / 2],
      [width, (height + contentHeight) / 2],
    ]);
    brokenLineTo(context, [
      [width - 5, (height + contentHeight) / 2 - 5],
      [width, (height + contentHeight) / 2],
      [width - 5, (height + contentHeight) / 2 + 5],
    ]);

    // draw content
    brokenLineTo(
      context,
      points.map((point) => [
        ((point[0] - minX) / (maxX - minX)) * contentWidth + offsetX,
        (1 - (point[1] - minY) / (maxY - minY)) * contentHeight + offsetY,
      ])
    );
  }, [ref, points, contentSize, contentOffset, width, height]);
  return (
    <div style={{ ...styles.container, width, height }}>
      <canvas style={styles.canvas} width={width} height={height} ref={ref} />
      <span style={styles.textY}>实际个人所得税/y</span>
      <span style={styles.textX}>实际年终奖/x</span>
    </div>
  );
}

/**
 * 绘制一段折线
 * @param {CanvasRenderingContext2D} context
 * @param {[number,number]} points
 */
function brokenLineTo(
  context: CanvasRenderingContext2D,
  points: [number, number][]
) {
  context.save();
  context.beginPath();
  if (points.length) {
    context.moveTo(points[0][0], points[0][1]);
    for (const point of points) {
      context.lineTo(point[0], point[1]);
    }
    context.stroke();
  }
  context.restore();
}
