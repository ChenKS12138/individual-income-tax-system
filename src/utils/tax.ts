import { iterator } from "./index";

type Tax = {
  min: number; // 阶梯下限
  max: number; // 阶梯上限
  rate: number; // 税率
  quickCalculationDeduction: number; // 速算扣除数
};

type TaxSolution = {
  totalTax: number; // 总税额
  bonus: number; // 年终奖
  totalSalaryIncome: number; // 年总工资收入
  graph?: [number, number][]; // [最终年终奖，最终纳税额]
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
 * @param {number} income
 * @returns {Tax}
 */
export function getTaxRule(income: number): Tax {
  return taxTable.find((one) => income > one.min && income <= one.max) ?? null;
}

/**
 * 根据月收入得到税额
 * @param {number} income
 * @returns {number}
 */
function getSalaryTax(income: number): number {
  if (income < 0) return null;
  const tax = getTaxRule(Math.max(0, income - 5000));
  return tax.rate * income - tax.quickCalculationDeduction;
}

/**
 * 根据奖金得到税额
 * @param {number} income
 * @returns {number}
 */
function getBonusTax(income: number): number {
  if (income < 0) return null;
  const incomePerMonth = income / 12;
  const tax = getTaxRule(incomePerMonth);
  return incomePerMonth * tax.rate * 12 - tax.quickCalculationDeduction;
}

/**
 * 得到最终的税收
 * @param {nubmer} income
 * @param {number} bonus
 * @param {number} adjustMonth
 * @param {number} newBonus
 * @returns {number}
 */
function getTotoalTax(
  income: number,
  bonus: number,
  adjustMonth: number,
  newBonus: number
): number {
  if (adjustMonth === 0) {
    return Number((getSalaryTax(income) * 12 + getBonusTax(bonus)).toFixed(2));
  }
  return Number(
    (
      getSalaryTax(income + (bonus - newBonus) / adjustMonth) * adjustMonth +
      getSalaryTax(income) * (12 - adjustMonth) +
      getBonusTax(newBonus)
    ).toFixed(2)
  );
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
}: Readonly<{
  realIncome: number;
  bonus: number;
}>): TaxSolution {
  const totalTax = getTotoalTax(realIncome, bonus, 0, bonus);
  const totalSalaryIncome = realIncome * 12;
  return {
    bonus: bonus,
    totalTax,
    totalSalaryIncome,
  };
}

/**
 * 获取最低税额的方案
 * @param {object} param0
 * @param {number} param0.realIncome
 * @param {number} param0.bonus
 * @param {number} param0.maxMonthCount
 * @returns {TaxSolution}
 */
export function getSolution2({
  bonus,
  maxMonthCount,
  realIncome,
}: Readonly<{
  realIncome: number;
  bonus: number;
  maxMonthCount: number;
}>): TaxSolution {
  if (maxMonthCount === 0) {
    return getOriginalTaxSolution({
      realIncome,
      bonus,
    });
  }
  const graph = [];
  const cap = Math.min(bonus + 1, 500000);
  const step = Math.max(1, Math.ceil((bonus + 1) / cap));

  let solution: TaxSolution = {
    totalTax: Infinity,
    bonus,
    graph: [],
    totalSalaryIncome: realIncome * 12,
  };
  iterator(cap)(function (key) {
    const newBonus = key * step;
    const totalTax = getTotoalTax(realIncome, bonus, maxMonthCount, newBonus);
    graph.push([newBonus, totalTax]);
    if (totalTax < solution.totalTax) {
      solution = {
        totalTax,
        bonus: newBonus,
        graph,
        totalSalaryIncome: realIncome * 12 + bonus - newBonus,
      };
    }
  });
  return solution;
}

/**
 * 包含了自定义的调整的每月工资，计算纳税方案
 * @param {object} param0
 * @param {number} param0.bonus
 * @param {number} param0.maxMonthCount
 * @param {number} param0.realIncome
 * @param {number} param0.adjustedIncome
 * @param {number[]} param0.customIncomesRatio
 * @returns {TaxSolution}
 */
export function getCustomTaxSolution({
  bonus,
  maxMonthCount,
  realIncome,
  adjustedIncome,
  customIncomesRatio,
}: Readonly<{
  realIncome: number;
  adjustedIncome: number;
  bonus: number;
  maxMonthCount: number;
  customIncomesRatio: number[];
}>): TaxSolution {
  if (maxMonthCount === 0) {
    return getOriginalTaxSolution({
      realIncome,
      bonus,
    });
  }
  const cap = Math.min(bonus + 1, 500000);
  const step = Math.max(1, Math.ceil((bonus + 1) / cap));

  const graph = [];
  let totalTax = Infinity;

  iterator(cap)(function (key) {
    const newBonus = key * step;
    const currentAdjustedIncome =
      (bonus - newBonus) / maxMonthCount + realIncome;
    const customIncomeTax = customIncomesRatio
      .map((ratio) => ratio * maxMonthCount * currentAdjustedIncome)
      .map((one) => getSalaryTax(one))
      .reduce((prev, current) => prev + current);
    const currentTotalTax =
      customIncomeTax +
      getSalaryTax(realIncome) * (12 - maxMonthCount) +
      getBonusTax(newBonus);
    if (currentTotalTax < totalTax) {
      totalTax = currentTotalTax;
    }
    graph.push([newBonus, currentTotalTax]);
  });
  const newBonus = bonus - (adjustedIncome - realIncome) * maxMonthCount;
  return {
    bonus: newBonus,
    totalSalaryIncome:
      adjustedIncome * maxMonthCount + realIncome * (12 - maxMonthCount),
    graph,
    totalTax,
  };
}
