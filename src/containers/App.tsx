import React, { useState, useMemo } from "react";
import { getLeastTaxSolution, getOriginalTaxSolution } from "~/utils";
import { Input, Card, Divider } from "~/components";

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
      getLeastTaxSolution({
        maxMonthCount: maxMonthCount,
        bonus,
        realIncome: income,
      }),
    [maxMonthCount, bonus, income]
  );

  return (
    <div style={styles.app}>
      <Card>
        <h3>个人综合所得税调整系统</h3>
        <Divider />
        <div>
          <div>
            <label htmlFor="income">每月收入: </label>
            <Input.Number
              value={income}
              onInput={setIncome}
              id="income"
              type="text"
            />
          </div>
          <div>
            <label htmlFor="bonus">年终奖: </label>
            <Input.Number
              value={bonus}
              onInput={setBonus}
              id="bonus"
              type="text"
            />
          </div>
          <div>
            <label htmlFor="max-month-count">最多调整月份数：</label>
            <Input.Number
              id="max-month-count"
              value={maxMonthCount}
              type="text"
              onInput={setMaxMonthCount}
            />
          </div>
          <Divider />
          <div>
            <span>
              原总个人所得税为{originalTaxSolution.totalTax.toFixed(2)}元
            </span>
          </div>
          <div>
            <span>
              调整后总个人所得税{leastTaxSolution.totalTax.toFixed(2)}元
            </span>
          </div>
          <div>
            <span>调整后的年终奖为{leastTaxSolution.bonus.toFixed(2)}元</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
