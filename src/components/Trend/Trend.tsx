import React, { useEffect, useMemo, useRef } from "react";
import { iterator } from "~/utils";
import styles from "./Trend.style";

interface ITrend {
  points: [number, number][];
  width: number;
  height: number;
  axisTitleX?: string;
  axistitleY?: string;
}

const X_AXIS_STEP = 9;
const Y_AXIS_STEP = 9;

export default function Trend({
  points,
  width,
  height,
  axisTitleX,
  axistitleY,
}: ITrend) {
  const ref = useRef(null);

  const contentOffset: [number, number] = useMemo(
    () =>
      // [offsetX,offsetY]
      [80, 0],
    []
  );

  const contentSize = useMemo(() => [width - 80, height - 30], [width, height]);

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

    // draw x-axis
    renderBrokenLine(context, [
      [offsetX - 20 - 10, (height + contentHeight) / 2],
      [width, (height + contentHeight) / 2],
    ]);
    renderBrokenLine(context, [
      [width - 5, (height + contentHeight) / 2 - 5],
      [width, (height + contentHeight) / 2],
      [width - 5, (height + contentHeight) / 2 + 5],
    ]);
    iterator(Y_AXIS_STEP)(function (key) {
      renderBrokenLine(context, [
        [offsetX - 20 - 5, (contentHeight + offsetY) * (1 - key / Y_AXIS_STEP)],
        [offsetX - 20 + 5, (contentHeight + offsetY) * (1 - key / Y_AXIS_STEP)],
      ]);
      points.length &&
        renderText(
          context,
          formatScale(minY + (maxY - minY || 1) * (key / Y_AXIS_STEP)),
          [
            offsetX - 20 - 10,
            (contentHeight + offsetY) * (1 - key / Y_AXIS_STEP),
          ],
          "middle",
          "right",
          50
        );
    });

    // draw y-axis
    renderBrokenLine(context, [
      [offsetX - 20, 0],
      [offsetX - 20, contentHeight + 25],
    ]);
    renderBrokenLine(context, [
      [offsetX - 20 - 5, 5],
      [offsetX - 20, 0],
      [offsetX - 20 + 5, 5],
    ]);
    iterator(X_AXIS_STEP)(function (key) {
      renderBrokenLine(context, [
        [
          offsetX + contentWidth * (key / X_AXIS_STEP),
          (height + contentHeight) / 2 - 5,
        ],
        [
          offsetX + contentWidth * (key / X_AXIS_STEP),
          (height + contentHeight) / 2 + 5,
        ],
      ]);
      points.length &&
        renderText(
          context,
          formatScale(minX + (maxX - minX) * (key / X_AXIS_STEP)),
          [
            offsetX + contentWidth * (key / X_AXIS_STEP),
            (height + contentHeight) / 2 + 10,
          ],
          "middle",
          "center",
          50
        );
    });

    // draw content
    renderBrokenLine(
      context,
      points.map((point) => [
        ((point[0] - minX) / (maxX - minX)) * contentWidth + offsetX,
        (1 - (point[1] - minY) / Math.max(maxY - minY, 0.001)) * contentHeight +
          offsetY,
      ])
    );
  }, [ref, points, contentSize, contentOffset, width, height]);

  // 慎用 有问题
  // useEffect(() => {
  //   const context: CanvasRenderingContext2D = ref.current.getContext("2d");
  //   context.setTransform(
  //     window.devicePixelRatio,
  //     0,
  //     0,
  //     window.devicePixelRatio,
  //     0,
  //     0
  //   );
  // }, []);

  return (
    <div style={{ ...styles.container, width, height }}>
      <canvas style={styles.canvas} width={width} height={height} ref={ref} />
      <span style={styles.textY}>{axistitleY}</span>
      <span style={styles.textX}>{axisTitleX}</span>
    </div>
  );
}

/**
 * 绘制一段折线
 * @param {CanvasRenderingContext2D} context
 * @param {[number,number]} points
 */
function renderBrokenLine(
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

/**
 * 绘制一段文字
 * @param {CanvasRenderingContext2D} context
 * @param {string} text
 * @param {[number,number]} point
 * @param {CanvasTextBaseline} textBaseline
 * @param {CanvasTextAlign} textAlign
 * @param {number} maxWidth
 */
function renderText(
  context: CanvasRenderingContext2D,
  text: string,
  point: [number, number],
  textBaseline: CanvasTextBaseline,
  textAlign: CanvasTextAlign,
  maxWidth: number
) {
  context.save();
  context.textBaseline = textBaseline;
  context.textAlign = textAlign;
  context.font = "8px serif";
  context.fillText(text, point[0], point[1], maxWidth);
  context.restore();
}

/**
 * @param {number} num
 * @returns {string}
 */
function formatScale(num: number): string {
  if (num < 10) {
    return num.toFixed(2);
  }
  return num.toFixed(0);
}
