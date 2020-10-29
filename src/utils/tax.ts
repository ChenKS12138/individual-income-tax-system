type Tax = {
  min: number; // 阶梯下限
  max: number; // 阶梯上限
  rate: number; // 税率
  quickCalculationDeduction: number; // 速算扣除数
};

type TaxSolution = {
  totalTax: number; // 总税收
  bonus: number; // 年终奖
};

export const taxTable: Array<Tax> = [
  {
    min: -Infinity,
    max: 3000,
    rate: 0.03,
    quickCalculationDeduction: 0,
  },
  {
    min: 3000,
    max: 12000,
    rate: 0.1,
    quickCalculationDeduction: 210,
  },
  {
    min: 12000,
    max: 25000,
    rate: 0.2,
    quickCalculationDeduction: 1410,
  },
  {
    min: 25000,
    max: 35000,
    rate: 0.25,
    quickCalculationDeduction: 2660,
  },
  {
    min: 35000,
    max: 55000,
    rate: 0.3,
    quickCalculationDeduction: 4410,
  },
  {
    min: 55000,
    max: 80000,
    rate: 0.35,
    quickCalculationDeduction: 7160,
  },
  {
    min: 80000,
    max: Infinity,
    rate: 0.45,
    quickCalculationDeduction: 15160,
  },
];

/**
 *  根据月收入得到税率
 * @param monthlyIncome 月收入
 * @returns {Tax}
 */
export function getTax(monthlyIncome: number): Tax {
  if (monthlyIncome < 0) return null;
  return taxTable.find(
    (one) => monthlyIncome > one.min && monthlyIncome <= one.max
  );
}

/**
 * 获取最低的纳税方案
 * @param {object} param0
 * @param {number} param0.maxMonthCount
 * @param {number} param0.realIncome
 * @param {number} param0.bonus
 * @returns {TaxSolution}
 */
export function getLeastTaxSolution({
  maxMonthCount,
  realIncome,
  bonus,
}: {
  maxMonthCount: number;
  realIncome: number;
  bonus: number;
}): TaxSolution {
  if (maxMonthCount < 0 || maxMonthCount > 12) return null;
  const newBonus = (realIncome * maxMonthCount + bonus) / (maxMonthCount + 1);
  const tax1 = getTax(realIncome);
  const tax2 = getTax(newBonus);
  const totalTax =
    (tax1?.rate * realIncome - tax1?.quickCalculationDeduction) *
      (12 - maxMonthCount) +
    (tax2?.rate * newBonus - tax2?.quickCalculationDeduction) *
      (maxMonthCount + 1);
  return {
    bonus: newBonus,
    totalTax,
  };
}

/**
 * 获得最初的纳税方案
 * @param {object} param0
 * @param {number} param0.realIncome
 * @param {number} param0.bonus
 * @returns {TaxSolution}
 */
export function getOriginalTaxSolution({
  realIncome,
  bonus,
}: {
  realIncome: number;
  bonus: number;
}): TaxSolution {
  return getLeastTaxSolution({
    realIncome,
    bonus,
    maxMonthCount: 0,
  });
}
