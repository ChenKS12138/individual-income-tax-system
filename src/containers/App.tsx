import React, { useState, useMemo } from "react";
import { getOriginalTaxSolution, getSolution2, rarefyArray } from "~/utils";
import { Input, Card, Divider, Trend } from "~/components";

import styles from "./App.style";

export default function App() {
  const [income, setIncome] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [maxMonthCount, setMaxMonthCount] = useState(0);

  const taxableIncome = useMemo(() => Math.max(0, income - 5000), [income]);

  const originalTaxSolution = useMemo(
    () =>
      getOriginalTaxSolution({
        bonus,
        realIncome: taxableIncome,
      }),
    [bonus, taxableIncome]
  );

  const leastTaxSolution = useMemo(
    () =>
      getSolution2({
        maxMonthCount: maxMonthCount,
        bonus,
        realIncome: taxableIncome,
      }),
    [maxMonthCount, bonus, taxableIncome]
  );

  const originalTaxSolutionTotalIncome = useMemo(
    () => income * 12 + bonus - originalTaxSolution.bonus,
    [income, bonus, originalTaxSolution, originalTaxSolution.bonus]
  );

  const leastTaxSolutionTotalIncome = useMemo(
    () => income * 12 + bonus - leastTaxSolution.bonus,
    [income, bonus, leastTaxSolution, leastTaxSolution.bonus]
  );

  const points = useMemo(
    () => rarefyArray(leastTaxSolution.graph ?? [], 1000),
    [leastTaxSolution, leastTaxSolution.graph]
  );

  return (
    <div style={styles.app}>
      <Card style={styles.card}>
        <h3 style={styles.title}>个人综合所得税调整系统</h3>
        <Divider />
        <div>
          <h5 style={{ ...styles.title, marginBottom: "5px" }}>用户信息输入</h5>
          <div style={styles.formItem}>
            <label htmlFor="income">每月收入（元）: </label>
            <Input.Number
              min={0}
              value={income}
              onInput={setIncome}
              id="income"
              type="text"
            />
          </div>
          <div style={styles.formItem}>
            <label htmlFor="bonus">年终奖（元）: </label>
            <Input.Number
              min={0}
              value={bonus}
              onInput={setBonus}
              id="bonus"
              type="text"
            />
          </div>
          <div style={styles.formItem}>
            <label htmlFor="max-month-count">调整的月份数：</label>
            <Input.Number
              min={0}
              max={3}
              id="max-month-count"
              value={maxMonthCount}
              type="text"
              onInput={setMaxMonthCount}
            />
          </div>
          <Divider />
          <h5 style={{ ...styles.title, marginBottom: "5px" }}>调整前后对比</h5>
          <div style={{ ...styles.result.container, marginBottom: "5px" }}>
            <div>
              <p>原年工资收入：{originalTaxSolutionTotalIncome}元</p>
              <p>原年终奖：{originalTaxSolution.bonus}元</p>
              <p>原总税额：{originalTaxSolution.totalTax}元</p>
            </div>
            <div>
              <p>现年工资收入：{leastTaxSolutionTotalIncome}元</p>
              <p>现年终奖：{leastTaxSolution.bonus}元</p>
              <p>现总税额：{leastTaxSolution.totalTax}元</p>
            </div>
          </div>
          <Divider />
          <div style={{ ...styles.result.graph, marginBottom: "5px" }}>
            <h5 style={{ marginBottom: "5px" }}>
              每月收入和实际个人所得税趋势图
            </h5>
            <Trend
              points={points ?? []}
              width={500}
              height={300}
              axistitleY="实际个人所得税（元）/y"
              axisTitleX="实际年终奖（元）/x"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
