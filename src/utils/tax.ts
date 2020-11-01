type Tax = {
  min: number; // 阶梯下限
  max: number; // 阶梯上限
  rate: number; // 税率
  quickCalculationDeduction: number; // 速算扣除数
};

type TaxSolution = {
  totalTax: number; // 总税额
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
 * @param income
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
  const tax = getTaxRule(income);
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
  const tax = getTaxRule(income);
  return incomePerMonth * tax.rate * 12 - tax.quickCalculationDeduction;
}

/**
 * 得到最终的税收
 * @param {nubmer} income
 * @param {number} bonus
 * @param {number} adjustMonth
 * @param {number} adjustBonus
 */
function getTotoalTax(
  income: number,
  bonus: number,
  adjustMonth: number,
  adjustBonus: number
): number {
  if (adjustMonth === 0) {
    return Number((getSalaryTax(income) * 12 + getBonusTax(bonus)).toFixed(2));
  }
  return Number(
    (
      getSalaryTax(income + adjustBonus / adjustMonth) * adjustMonth +
      getSalaryTax(income) * (12 - adjustMonth) +
      getBonusTax(bonus - adjustBonus)
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
}: {
  realIncome: number;
  bonus: number;
}): TaxSolution {
  const totalTax = getTotoalTax(realIncome, bonus, 0, 0);
  return {
    bonus: bonus,
    totalTax,
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
}: {
  realIncome: number;
  bonus: number;
  maxMonthCount: number;
}): TaxSolution {
  if (maxMonthCount === 0) {
    return getOriginalTaxSolution({
      realIncome,
      bonus,
    });
  }
  const solution = Array.from({ length: bonus + 1 })
    .map((x, key) => bonus - key)
    .reduce(
      (prev, current) => {
        const totalTax = getTotoalTax(
          realIncome,
          bonus,
          maxMonthCount,
          current
        );
        if (totalTax < prev.totalTax) {
          return {
            totalTax,
            bonus: current,
          };
        }
        return prev;
      },
      {
        totalTax: Infinity,
        bonus,
      }
    );
  return solution;
}
