import React, { useState, useMemo, useEffect } from "react";
import {
  getCustomTaxSolution,
  getOriginalTaxSolution,
  getSolution2,
  useConstraintArray,
} from "~/utils";
import { Input, Card, Divider, Trend } from "~/components";

import styles from "./App.style";

export default function App() {
  const [income, setIncome] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [maxMonthCount, setMaxMonthCount] = useState(0);

  const originalTaxSolution = useMemo(
    () =>
      getOriginalTaxSolution({
        bonus,
        realIncome: income,
      }),
    [bonus, income]
  );

  const leastTaxSolution = useMemo(
    () =>
      getSolution2({
        maxMonthCount: maxMonthCount,
        bonus,
        realIncome: income,
      }),
    [maxMonthCount, bonus, income]
  );

  const customIncomesRatio = useMemo(
    () =>
      ({
        "1": [1],
        "2": [0.5, 0.5],
        "3": [0.3, 0.3, 0.4],
      }[maxMonthCount] ?? []),
    [maxMonthCount, income, bonus]
  );
  const [
    constraintCustomIncomesRatio,
    updateConstraintCustomIncomesRatio,
  ] = useConstraintArray(customIncomesRatio);

  const isCustomIncome = useMemo(
    () =>
      constraintCustomIncomesRatio.some((value, index, arr) =>
        index === 0 ? false : value !== arr[index - 1]
      ),
    [constraintCustomIncomesRatio]
  );

  const customTaxSolution = useMemo(
    () =>
      isCustomIncome
        ? getCustomTaxSolution({
            bonus,
            maxMonthCount,
            adjustedIncome:
              maxMonthCount &&
              income + (bonus - leastTaxSolution?.bonus) / maxMonthCount,
            realIncome: income,
            customIncomesRatio: constraintCustomIncomesRatio,
          })
        : null,
    [bonus, maxMonthCount, income, constraintCustomIncomesRatio, isCustomIncome]
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
          {maxMonthCount > 0 ? (
            <>
              <Divider />
              <h5 style={{ ...styles.title, marginBottom: "5px" }}>
                自定义被调整月份的工资
              </h5>
              <div>
                {constraintCustomIncomesRatio.map((item, key) => {
                  return (
                    <div key={key} style={styles.formItem}>
                      <label>第{key + 1}个月份</label>
                      <Input.Number
                        value={Number(item.toFixed(2))}
                        // value={item}
                        onInput={(value) => {
                          updateConstraintCustomIncomesRatio(key, value);
                        }}
                        max={1}
                        min={0}
                        step={0.01}
                        id={"input" + key}
                        type="text"
                      />
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}
          <Divider />
          <h5 style={{ ...styles.title, marginBottom: "5px" }}>调整前后对比</h5>
          <div style={{ ...styles.result.container, marginBottom: "5px" }}>
            <div>
              <p>原年工资收入：{originalTaxSolution.totalSalaryIncome}元</p>
              <p>原年终奖：{originalTaxSolution.bonus}元</p>
              <p>原总税额：{originalTaxSolution.totalTax}元</p>
            </div>
            <div>
              <p>现年工资收入：{leastTaxSolution.totalSalaryIncome}元</p>
              <p>现年终奖：{leastTaxSolution.bonus}元</p>
              <p>现总税额：{leastTaxSolution.totalTax}元</p>
            </div>
            {isCustomIncome ? (
              <div>
                <div>
                  <p>
                    自定义方案的年工资收入：
                    {customTaxSolution.totalSalaryIncome}元
                  </p>
                  <p>自定义方案的年终奖：{customTaxSolution.bonus}元</p>
                  <p>自定义方案的总税额：{customTaxSolution.totalTax}元</p>
                </div>
              </div>
            ) : null}
          </div>
          <Divider />
          <div style={{ ...styles.result.graph, marginBottom: "5px" }}>
            <h5 style={{ marginBottom: "5px" }}>
              实际年终奖和实际个人所得税趋势图
            </h5>
            <Trend
              lines={[
                {
                  name: "现方案",
                  points: leastTaxSolution.graph,
                },
                isCustomIncome
                  ? {
                      name: "自定义方案",
                      points: customTaxSolution.graph,
                    }
                  : null,
              ]}
              width={750}
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
