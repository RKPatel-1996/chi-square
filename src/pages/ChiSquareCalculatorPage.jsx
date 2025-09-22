import React, { useState, useMemo } from "react";

// A small helper component for consistent section titles
const SectionTitle = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
      {title}
    </h2>
    <p className="text-lg text-slate-600 dark:text-slate-400">{subtitle}</p>
  </div>
);

// A helper for displaying formulas
const Formula = ({ children }) => (
  <div className="p-4 my-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
    <span className="text-xl font-mono text-slate-700 dark:text-slate-300">
      {children}
    </span>
  </div>
);

export function ChiSquareCalculatorPage() {
  // State for the 4 observed values in the 2x2 table
  const [observed, setObserved] = useState({ a: 22, b: 78, c: 45, d: 55 });

  // State for the labels of rows and columns
  const [labels, setLabels] = useState({
    row1: "Gram-positive",
    row2: "Gram-negative",
    col1: "Growth",
    col2: "No Growth",
  });

  // --- DERIVED CALCULATIONS using useMemo for performance ---
  const totals = useMemo(() => {
    const { a, b, c, d } = observed;
    const row1Total = a + b;
    const row2Total = c + d;
    const col1Total = a + c;
    const col2Total = b + d;
    const grandTotal = a + b + c + d;
    return { row1Total, row2Total, col1Total, col2Total, grandTotal };
  }, [observed]);

  const expected = useMemo(() => {
    const { row1Total, row2Total, col1Total, col2Total, grandTotal } = totals;
    if (grandTotal === 0) return { a: 0, b: 0, c: 0, d: 0 };
    return {
      a: (row1Total * col1Total) / grandTotal,
      b: (row1Total * col2Total) / grandTotal,
      c: (row2Total * col1Total) / grandTotal,
      d: (row2Total * col2Total) / grandTotal,
    };
  }, [totals]);

  const chiSquareComponents = useMemo(() => {
    const calc = (obs, exp) => {
      if (exp === 0) return { diff: 0, diffSq: 0, component: 0 };
      const diff = obs - exp;
      const diffSq = Math.pow(diff, 2);
      const component = diffSq / exp;
      return { diff, diffSq, component };
    };
    return {
      a: calc(observed.a, expected.a),
      b: calc(observed.b, expected.b),
      c: calc(observed.c, expected.c),
      d: calc(observed.d, expected.d),
    };
  }, [observed, expected]);

  const chiSquareValue = useMemo(() => {
    return (
      chiSquareComponents.a.component +
      chiSquareComponents.b.component +
      chiSquareComponents.c.component +
      chiSquareComponents.d.component
    );
  }, [chiSquareComponents]);

  // --- Constants for Interpretation ---
  const degreesOfFreedom = 1; // For a 2x2 table
  const significanceLevel = 0.05;
  const criticalValue = 3.841;
  const isSignificant = chiSquareValue > criticalValue;

  // --- Handlers for input changes ---
  const handleObservedChange = (e, key) => {
    const value = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
    setObserved((prev) => ({ ...prev, [key]: isNaN(value) ? 0 : value }));
  };

  const handleLabelChange = (e, key) => {
    setLabels((prev) => ({ ...prev, [key]: e.target.value }));
  };

  // Helper to format numbers for display
  const formatNum = (num) => (isNaN(num) ? "N/A" : num.toFixed(3));

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* === HEADER === */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
            Interactive Chi-Square (χ²) Calculator
          </h1>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-300">
            A real-time analysis of the "Microbe-Stop" disinfectant study.
          </p>
        </header>

        {/* --- NEW: Research Question Section --- */}
        <section className="mb-12 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border-l-4 border-blue-500">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            The Research Question
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Is there a statistically significant association between the type of
            bacteria (Gram-positive vs. Gram-negative) and the effectiveness of
            the "Microbe-Stop" disinfectant?
          </p>
        </section>

        {/* --- UPDATED: Foundational Questions with better dark mode contrast --- */}
        <section className="mb-12 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
          <SectionTitle
            title="Part 1: Foundational Questions"
            subtitle="Ensuring the test is appropriate for the data."
          />
          <div className="space-y-4">
            <p className="text-slate-700 dark:text-slate-300">
              The Chi-Square (χ²) test of independence is used to determine if
              there is a significant association between two categorical
              variables. Our study on "Microbe-Stop" fits perfectly because we
              have two categorical variables:
            </p>
            <ul className="list-disc list-inside pl-4 text-slate-700 dark:text-sky-300">
              <li>
                <span className="font-semibold text-slate-800 dark:text-sky-200">
                  Bacterial Type:
                </span>{" "}
                Categories are "{labels.row1}" and "{labels.row2}".
              </li>
              <li>
                <span className="font-semibold text-slate-800 dark:text-sky-200">
                  Treatment Outcome:
                </span>{" "}
                Categories are "{labels.col1}" and "{labels.col2}".
              </li>
            </ul>
            <p className="font-semibold text-slate-800 dark:text-slate-200 pt-2">
              What is the Degree of Freedom (df)?
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              For a 2x2 table, the degree of freedom is always 1.
            </p>
            <Formula>
              df = (Rows - 1) × (Columns - 1) = (2 - 1) × (2 - 1) = 1
            </Formula>
          </div>
        </section>

        {/* === PART 2: THE CALCULATION === */}
        <section className="mb-12">
          <SectionTitle
            title="Part 2: The Step-by-Step Calculation"
            subtitle="Input your data and see the magic happen in real-time."
          />

          {/* --- Interactive Contingency Table --- */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mb-8">
            <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
              Observed Data (O)
            </h3>
            <p className="mb-4 text-slate-600 dark:text-slate-400">
              This is your collected data. Change the values or labels below to
              see all calculations update instantly.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-700">
                    <th className="p-3 border border-slate-300 dark:border-slate-600"></th>
                    <th className="p-3 border border-slate-300 dark:border-slate-600">
                      <input
                        type="text"
                        value={labels.col1}
                        onChange={(e) => handleLabelChange(e, "col1")}
                        className="w-full bg-transparent text-center font-bold"
                      />
                    </th>
                    <th className="p-3 border border-slate-300 dark:border-slate-600">
                      <input
                        type="text"
                        value={labels.col2}
                        onChange={(e) => handleLabelChange(e, "col2")}
                        className="w-full bg-transparent text-center font-bold"
                      />
                    </th>
                    <th className="p-3 border border-slate-300 dark:border-slate-600 font-bold">
                      Row Total
                    </th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="p-3 border border-slate-300 dark:border-slate-600 font-bold">
                      <input
                        type="text"
                        value={labels.row1}
                        onChange={(e) => handleLabelChange(e, "row1")}
                        className="w-full bg-transparent text-center font-bold"
                      />
                    </td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">
                      <input
                        type="number"
                        value={observed.a}
                        onChange={(e) => handleObservedChange(e, "a")}
                        className="w-20 p-2 text-center rounded bg-slate-100 dark:bg-slate-700"
                      />
                    </td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">
                      <input
                        type="number"
                        value={observed.b}
                        onChange={(e) => handleObservedChange(e, "b")}
                        className="w-20 p-2 text-center rounded bg-slate-100 dark:bg-slate-700"
                      />
                    </td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600 font-bold">
                      {totals.row1Total}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-slate-300 dark:border-slate-600 font-bold">
                      <input
                        type="text"
                        value={labels.row2}
                        onChange={(e) => handleLabelChange(e, "row2")}
                        className="w-full bg-transparent text-center font-bold"
                      />
                    </td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">
                      <input
                        type="number"
                        value={observed.c}
                        onChange={(e) => handleObservedChange(e, "c")}
                        className="w-20 p-2 text-center rounded bg-slate-100 dark:bg-slate-700"
                      />
                    </td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">
                      <input
                        type="number"
                        value={observed.d}
                        onChange={(e) => handleObservedChange(e, "d")}
                        className="w-20 p-2 text-center rounded bg-slate-100 dark:bg-slate-700"
                      />
                    </td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600 font-bold">
                      {totals.row2Total}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 dark:bg-slate-700 font-bold">
                    <td className="p-3 border border-slate-300 dark:border-slate-600">
                      Column Total
                    </td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">
                      {totals.col1Total}
                    </td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">
                      {totals.col2Total}
                    </td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">
                      {totals.grandTotal}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* --- UPDATED: Hypotheses with better dark mode contrast --- */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-100">
              Step 1: State the Hypotheses
            </h3>
            <div className="p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md space-y-3 border border-slate-200 dark:border-slate-700">
              {/* Null Hypothesis */}
              <p className="text-slate-700 dark:text-slate-300">
                <strong className="font-semibold text-teal-600 dark:text-teal-400">
                  Null Hypothesis (H₀):
                </strong>{" "}
                There is{" "}
                <strong className="font-semibold text-slate-900 dark:text-white">
                  no statistically significant association
                </strong>{" "}
                between the bacterial type and the disinfectant's effectiveness.
                The variables are independent.
              </p>

              {/* Alternative Hypothesis */}
              <p className="text-slate-700 dark:text-slate-300">
                <strong className="font-semibold text-cyan-600 dark:text-cyan-400">
                  Alternative Hypothesis (Hₐ):
                </strong>{" "}
                There is{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  a statistically significant association
                </span>{" "}
                between the variables. They are dependent.
              </p>
            </div>
          </div>
          {/* --- Expected Frequencies --- */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-100">
              Step 2: Calculate Expected Frequencies (E)
            </h3>
            <p className="mb-4 text-slate-600 dark:text-slate-400">
              These are the values we would expect if the Null Hypothesis were
              true.
            </p>
            <Formula>E = (Row Total × Column Total) / Grand Total</Formula>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
                <p className="font-semibold">
                  {labels.row1}, {labels.col1}
                </p>
                <p className="font-mono text-sm text-slate-500">
                  ({totals.row1Total} * {totals.col1Total}) /{" "}
                  {totals.grandTotal}
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatNum(expected.a)}
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
                <p className="font-semibold">
                  {labels.row1}, {labels.col2}
                </p>
                <p className="font-mono text-sm text-slate-500">
                  ({totals.row1Total} * {totals.col2Total}) /{" "}
                  {totals.grandTotal}
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatNum(expected.b)}
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
                <p className="font-semibold">
                  {labels.row2}, {labels.col1}
                </p>
                <p className="font-mono text-sm text-slate-500">
                  ({totals.row2Total} * {totals.col1Total}) /{" "}
                  {totals.grandTotal}
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatNum(expected.c)}
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
                <p className="font-semibold">
                  {labels.row2}, {labels.col2}
                </p>
                <p className="font-mono text-sm text-slate-500">
                  ({totals.row2Total} * {totals.col2Total}) /{" "}
                  {totals.grandTotal}
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatNum(expected.d)}
                </p>
              </div>
            </div>
          </div>

          {/* --- Chi-Square Calculation Table --- */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-100">
              Step 3: Create the Calculation Table
            </h3>
            <div className="overflow-x-auto bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
              <table className="w-full min-w-[600px] text-center">
                <thead className="bg-slate-100 dark:bg-slate-700">
                  <tr>
                    <th className="p-2 border-b-2 border-slate-200 dark:border-slate-600">
                      Category
                    </th>
                    <th className="p-2 border-b-2 border-slate-200 dark:border-slate-600">
                      O
                    </th>
                    <th className="p-2 border-b-2 border-slate-200 dark:border-slate-600">
                      E
                    </th>
                    <th className="p-2 border-b-2 border-slate-200 dark:border-slate-600">
                      O - E
                    </th>
                    <th className="p-2 border-b-2 border-slate-200 dark:border-slate-600">
                      (O - E)²
                    </th>
                    <th className="p-2 border-b-2 border-slate-200 dark:border-slate-600">
                      (O - E)² / E
                    </th>
                  </tr>
                </thead>
                <tbody className="font-mono text-slate-700 dark:text-slate-300">
                  {[
                    {
                      label: `${labels.row1}, ${labels.col1}`,
                      obs: observed.a,
                      exp: expected.a,
                      comp: chiSquareComponents.a,
                    },
                    {
                      label: `${labels.row1}, ${labels.col2}`,
                      obs: observed.b,
                      exp: expected.b,
                      comp: chiSquareComponents.b,
                    },
                    {
                      label: `${labels.row2}, ${labels.col1}`,
                      obs: observed.c,
                      exp: expected.c,
                      comp: chiSquareComponents.c,
                    },
                    {
                      label: `${labels.row2}, ${labels.col2}`,
                      obs: observed.d,
                      exp: expected.d,
                      comp: chiSquareComponents.d,
                    },
                  ].map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-slate-200 dark:border-slate-700"
                    >
                      <td className="p-2 text-left font-sans">{row.label}</td>
                      <td className="p-2">{row.obs}</td>
                      <td className="p-2">{formatNum(row.exp)}</td>
                      <td className="p-2">{formatNum(row.comp.diff)}</td>
                      <td className="p-2">{formatNum(row.comp.diffSq)}</td>
                      <td className="p-2 font-bold text-blue-600 dark:text-blue-400">
                        {formatNum(row.comp.component)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* --- Final Chi-Square Value --- */}
          <div>
            <h3 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-100">
              Step 4: Calculate the Chi-Square Statistic (χ²)
            </h3>
            <Formula>χ² = Σ [ (O - E)² / E ]</Formula>
            <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Sum of the last column
              </p>
              <p className="text-6xl font-extrabold text-slate-800 dark:text-slate-100 my-2">
                {formatNum(chiSquareValue)}
              </p>
            </div>
          </div>
        </section>

        {/* === PART 3: INTERPRETATION === */}
        <section className="mb-12 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
          <SectionTitle
            title="Part 3: Interpretation of the Result 🔬"
            subtitle="Comparing our result against the critical value."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Calculated χ² Value
              </p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                {formatNum(chiSquareValue)}
              </p>
            </div>
            <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Significance Level (α)
              </p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                {significanceLevel}
              </p>
            </div>
            <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Critical Value (df={degreesOfFreedom})
              </p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                {criticalValue}
              </p>
            </div>
          </div>

          <div
            className={`mt-6 p-6 rounded-lg text-center transition-colors duration-300 ${
              isSignificant
                ? "bg-red-100 dark:bg-red-900/50"
                : "bg-green-100 dark:bg-green-900/50"
            }`}
          >
            <h4
              className={`text-2xl font-bold ${
                isSignificant
                  ? "text-red-800 dark:text-red-200"
                  : "text-green-800 dark:text-green-200"
              }`}
            >
              {isSignificant
                ? "Result is Statistically Significant"
                : "Result is Not Statistically Significant"}
            </h4>
            <p
              className={`mt-2 text-lg ${
                isSignificant
                  ? "text-red-700 dark:text-red-300"
                  : "text-green-700 dark:text-green-300"
              }`}
            >
              Since our calculated χ² value ({formatNum(chiSquareValue)}) is{" "}
              {isSignificant ? "GREATER" : "LESS"} than the critical value (
              {criticalValue}), we{" "}
              <strong className="font-extrabold">
                {isSignificant
                  ? "REJECT the Null Hypothesis (H₀)"
                  : "FAIL TO REJECT the Null Hypothesis (H₀)"}
              </strong>
              .
            </p>
            <p
              className={`mt-4 ${
                isSignificant
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              {isSignificant
                ? "Conclusion: There is strong evidence to suggest a significant association between the two variables."
                : "Conclusion: There is not enough evidence to suggest a significant association between the two variables."}
            </p>
          </div>
        </section>

        {/* --- NEW: Chi-Square Distribution Table --- */}
        <section className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
          <SectionTitle
            title="Reference: Chi-Square Critical Values"
            subtitle="Find the critical value based on your significance level (α) and degrees of freedom (df)."
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-center font-mono">
              <thead>
                <tr className="border-b-2 border-slate-300 dark:border-slate-600">
                  <th className="p-2">df</th>
                  <th className="p-2">α = 0.10</th>
                  <th className="p-2">α = 0.05</th>
                  <th className="p-2">α = 0.025</th>
                  <th className="p-2">α = 0.01</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 dark:text-slate-400">
                {[
                  { df: 1, values: [2.706, 3.841, 5.024, 6.635] },
                  { df: 2, values: [4.605, 5.991, 7.378, 9.21] },
                  { df: 3, values: [6.251, 7.815, 9.348, 11.345] },
                  { df: 4, values: [7.779, 9.488, 11.143, 13.277] },
                  { df: 5, values: [9.236, 11.07, 12.833, 15.086] },
                ].map((row) => (
                  <tr
                    key={row.df}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2 font-bold text-slate-800 dark:text-slate-200">
                      {row.df}
                    </td>
                    {row.values.map((val, index) => (
                      <td
                        key={index}
                        className={`p-2 ${
                          row.df === 1 && index === 1
                            ? "bg-blue-100 dark:bg-blue-900/50 rounded-lg font-bold text-blue-700 dark:text-blue-300"
                            : ""
                        }`}
                      >
                        {val.toFixed(3)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
