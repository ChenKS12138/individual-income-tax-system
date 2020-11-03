import React, { useEffect, useMemo, useRef } from "react";
import { iterator, rarefyArray } from "~/utils";
import styles from "./Trend.style";

interface ITrend {
  readonly lines: {
    name: string;
    points: [number, number][];
  }[];
  readonly width: number;
  readonly height: number;
  readonly axisTitleX?: string;
  readonly axistitleY?: string;
}

const X_AXIS_STEP = 9;
const Y_AXIS_STEP = 9;

export default function Trend({
  lines,
  width,
  height,
  axisTitleX,
  axistitleY,
}: ITrend) {
  const ref = useRef(null);

  const filteredLines = useMemo(
    () =>
      lines
        .filter((x) => !!x)
        .map((line) => ({
          ...line,
          points: rarefyArray(line.points ?? [], 1000),
        })),
    [lines]
  );

  const contentOffset: [number, number] = useMemo(
    () =>
      // [offsetX,offsetY]
      [180, 0],
    []
  );

  const contentSize = useMemo(() => [width - 180, height - 40], [
    width,
    height,
  ]);

  const [minX, maxX, minY, maxY] = useMemo(
    () =>
      filteredLines
        .map((one) => one.points)
        .reduce((prev, current) => [...prev, ...current])
        .reduce(
          (prev, current) => [
            Math.min(prev[0], current[0]),
            Math.max(prev[1], current[0]),
            Math.min(prev[2], current[1]),
            Math.max(prev[3], current[1]),
          ],
          [Infinity, -Infinity, Infinity, -Infinity]
        ),
    [filteredLines]
  );

  const hasDataReadyToRender = useMemo(
    () => filteredLines.some((one) => one.points.length > 0),
    [filteredLines, filteredLines.length]
  );

  useEffect(() => {
    const [contentWidth, contentHeight] = contentSize;
    const [offsetX, offsetY] = contentOffset;

    const context: CanvasRenderingContext2D = ref.current.getContext("2d");

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
      hasDataReadyToRender &&
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
      hasDataReadyToRender &&
        renderText(
          context,
          formatScale(minX + (maxX - minX) * (key / X_AXIS_STEP)),
          [
            offsetX + contentWidth * (key / X_AXIS_STEP),
            (height + contentHeight) / 2 + 15,
          ],
          "middle",
          "center",
          50
        );
    });

    // draw content
    hasDataReadyToRender &&
      filteredLines.forEach((line, key) => {
        const lineDash = generateLineDash(key);
        renderBrokenLine(
          context,
          line.points.map((point) => [
            ((point[0] - minX) / (maxX - minX)) * contentWidth + offsetX,
            (1 - (point[1] - minY) / Math.max(maxY - minY, 0.001)) *
              contentHeight +
              offsetY,
          ]),
          lineDash
        );
        renderBrokenLine(
          context,
          [
            [offsetX - 110, 40 + key * 20],
            [offsetX - 70, 40 + key * 20],
          ],
          lineDash
        );
        renderText(
          context,
          line.name,
          [offsetX - 115, 40 + key * 20],
          "middle",
          "right",
          40
        );
      });
  }, [ref, filteredLines, contentSize, contentOffset, width, height]);

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
 * @param {number[]} lineDash
 */
function renderBrokenLine(
  context: CanvasRenderingContext2D,
  points: [number, number][],
  lineDash: number[] = []
) {
  context.save();
  context.beginPath();
  context.setLineDash(lineDash);
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
  context.font = "12px serif";
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

/**
 * @param {number} key
 * @returns {number[]}
 */
function generateLineDash(key: number): number[] {
  if (key <= 0) return [];
  return [key * 5, ...Array.from({ length: key }).map((v, key) => 5)];
}
