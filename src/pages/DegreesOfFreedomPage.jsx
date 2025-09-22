import React, { useState, useMemo, useEffect } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea, // <-- Add this
  ResponsiveContainer,
} from "recharts";
// --- Statistical Helper Functions (Defined ONCE at the top) ---
const gamma = (n) => {
  const g = 7;
  const p = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (n < 0.5) return Math.PI / (Math.sin(Math.PI * n) * gamma(1 - n));
  n--;
  let x = p[0];
  for (let i = 1; i < g + 2; i++) {
    x += p[i] / (n + i);
  }
  const t = n + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * x;
};
const chi2PDF = (x, df) => {
  if (x < 0 || df <= 0) return 0;
  if (df === 2) return Math.exp(-x / 2) / 2;
  return (
    (Math.pow(x, df / 2 - 1) * Math.exp(-x / 2)) /
    (Math.pow(2, df / 2) * gamma(df / 2))
  );
};
const chi2CDF = (x, df) => {
  if (x <= 0) return 0;
  const n = 1000;
  const h = x / n;
  let sum = chi2PDF(0, df) + chi2PDF(x, df);
  for (let i = 1; i < n; i += 2) {
    sum += 4 * chi2PDF(i * h, df);
  }
  for (let i = 2; i < n - 1; i += 2) {
    sum += 2 * chi2PDF(i * h, df);
  }
  return Math.min(1, (h / 3) * sum);
};
const randn_bm = (mean, std) => {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * std + mean;
};

// --- Section 1: The "Friends at a Restaurant" Analogy ---
const LabTeamSim = () => {
  const totalBill = 100;
  const friendCount = 5;
  const [payments, setPayments] = useState({
    friend1: "",
    friend2: "",
    friend3: "",
    friend4: "",
  });

  const handlePaymentChange = (friend, value) => {
    const numValue = value === "" ? "" : parseInt(value, 10);
    setPayments((prev) => ({ ...prev, [friend]: numValue }));
  };

  const paidByFour = Object.values(payments)
    .filter((p) => p !== "")
    .reduce((acc, p) => acc + p, 0);
  const canCalculateFinal = Object.values(payments).every((p) => p !== "");
  const finalPayment = canCalculateFinal ? totalBill - paidByFour : null;

  const freeChoices =
    friendCount - 1 - Object.values(payments).filter((p) => p !== "").length;

  const handleReset = () => {
    setPayments({ friend1: "", friend2: "", friend3: "", friend4: "" });
  };

  return (
    <section className="bg-gray-900/50 p-6 rounded-md border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-cyan-300">
          The "Friends at a Restaurant" Analogy 💵
        </h3>
        <button
          onClick={handleReset}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded-lg text-sm"
        >
          Reset
        </button>
      </div>
      <p className="text-gray-300 mb-4">
        Imagine <b>{friendCount} friends</b> need to pay a total bill of{" "}
        <b>${totalBill}</b>. How many have a choice in what they pay?
      </p>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="space-y-3 bg-gray-800 p-4 rounded-lg">
          {Object.keys(payments).map((friend, index) => (
            <div key={friend} className="flex items-center gap-4">
              <label htmlFor={friend} className="w-24">
                Friend {index + 1}:
              </label>
              <span>$</span>
              <input
                id={friend}
                type="number"
                value={payments[friend]}
                onChange={(e) => handlePaymentChange(friend, e.target.value)}
                className="w-full bg-gray-700 p-2 rounded text-center"
                placeholder="Enter amount"
              />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="p-4 bg-gray-700 rounded-lg border-2 border-dashed border-cyan-400">
            <p className="font-bold">Friend 5 must pay:</p>
            <p className="text-4xl font-mono text-center p-4">
              {finalPayment !== null ? `$${finalPayment}` : "?"}{" "}
              {finalPayment !== null && "🔒"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 text-center bg-gray-800 rounded">
        <p className="text-2xl font-mono">
          Free Choices Remaining:{" "}
          <span className="font-bold text-amber-300">{freeChoices}</span>
        </p>
        {finalPayment !== null && (
          <p className="mt-2 text-amber-300 font-semibold animate-fade-in">
            Once the first 4 payments were known, the 5th payment was no longer
            free to vary. This system has 4 degrees of freedom.
          </p>
        )}
      </div>
    </section>
  );
};

// --- Section 2: Goodness-of-Fit Simulator ---
const GoodnessOfFitSim = () => {
  const totalColonies = 200;
  const [redColonies, setRedColonies] = useState(110);
  const whiteColonies = totalColonies - redColonies;

  const handleReset = () => {
    setRedColonies(110);
  };

  return (
    <section className="bg-gray-900/50 p-6 rounded-md border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-cyan-300">
          Example 1: Chi-Square Goodness-of-Fit 🎨
        </h3>
        <button
          onClick={handleReset}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded-lg text-sm"
        >
          Reset
        </button>
      </div>

      <p className="text-gray-300 mb-4">
        <b>Scenario:</b> You expect a 1:1 ratio of red to white colonies. You
        count <b>{totalColonies} total colonies</b>. The total is a fixed
        constraint.
      </p>

      <div className="p-4 bg-gray-800 rounded-lg">
        <label className="block mb-2">
          Number of Red Colonies:{" "}
          <span className="font-mono font-bold">{redColonies}</span>
        </label>
        <input
          type="range"
          min="0"
          max="200"
          value={redColonies}
          onChange={(e) => setRedColonies(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />

        <div className="mt-4 flex flex-col sm:flex-row gap-4 text-center">
          <div className="flex-1 p-3 bg-red-900/50 rounded">
            Red Colonies:
            <span className="font-bold block text-2xl">{redColonies}</span>
          </div>
          <div className="flex-1 p-3 bg-gray-700 rounded border-2 border-dashed border-cyan-400">
            White Colonies:
            <span className="font-bold block text-2xl">{whiteColonies} 🔒</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-amber-300 font-semibold text-center">
        Because the total is fixed, once you chose the red count, the white
        count was no longer free to vary. With 2 categories, you only had 1
        degree of freedom (df = 2 - 1).
      </p>
    </section>
  );
};

// --- Section 3: Test of Independence Simulator ---
const ContingencyTableSim = () => {
  const totals = { row1: 100, row2: 80, col1: 90, col2: 90, grand: 180 };
  const [cellA, setCellA] = useState("");

  // All other cells are derived from the single input cell 'a' and the fixed totals
  const cellB = cellA !== "" ? totals.row1 - cellA : "";
  const cellC = cellA !== "" ? totals.col1 - cellA : "";
  const cellD = cellA !== "" ? totals.row2 - cellC : "";

  const handleReset = () => setCellA("");

  const handleInputChange = (value) => {
    // Basic validation to prevent impossible numbers
    const num = value === "" ? "" : parseInt(value, 10);
    if (num > totals.row1 || num > totals.col1) {
      return; // Don't allow input larger than a row or column total
    }
    setCellA(num);
  };

  return (
    <section className="bg-gray-900/50 p-6 rounded-md border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-cyan-300">
          Example 2: Chi-Square Test of Independence ⛓️
        </h3>
        <button
          onClick={handleReset}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded-lg text-sm"
        >
          Reset
        </button>
      </div>
      <p className="text-gray-300 mb-4">
        <b>Scenario:</b> You're testing an association. The row and column
        totals are fixed constraints.{" "}
        <b>Fill in the top-left cell to see what happens.</b>
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px] text-center border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-600">
              <th className="p-2 w-1/4"></th>
              <th className="p-2 w-1/4">Inpatient</th>
              <th className="p-2 w-1/4">Outpatient</th>
              <th className="p-2 w-1/4 font-bold text-amber-300">Row Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-700">
              <td className="p-2 font-bold text-left">E. coli</td>
              <td className="p-2 bg-gray-800">
                <input
                  type="number"
                  value={cellA}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-24 bg-gray-700 p-2 rounded text-center"
                  placeholder="Enter #"
                />
              </td>
              <td className="p-2 bg-gray-700 font-mono text-xl">
                {cellB} {cellB !== "" && "🔒"}
              </td>
              <td className="p-2 font-bold text-amber-300">{totals.row1}</td>
            </tr>
            <tr className="border-b-2 border-gray-600">
              <td className="p-2 font-bold text-left">S. aureus</td>
              <td className="p-2 bg-gray-700 font-mono text-xl">
                {cellC} {cellC !== "" && "🔒"}
              </td>
              <td className="p-2 bg-gray-700 font-mono text-xl">
                {cellD} {cellD !== "" && "🔒"}
              </td>
              <td className="p-2 font-bold text-amber-300">{totals.row2}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold text-amber-300 text-left">
                Column Total
              </td>
              <td className="p-2 font-bold text-amber-300">{totals.col1}</td>
              <td className="p-2 font-bold text-amber-300">{totals.col2}</td>
              <td className="p-2 font-bold text-gray-500">{totals.grand}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-amber-300 font-semibold text-center">
        You only had the freedom to choose 1 cell. The row and column total
        constraints determined the rest! For this 2x2 table, df = (rows - 1) *
        (cols - 1) = 1.
      </p>
    </section>
  );
};

// --- Section 4: Distribution Shifter ---
const DistributionShifter = () => {
  const [df, setDf] = useState(1);
  const chiSquareValue = 8.0;

  const chartData = useMemo(() => {
    const data = [];
    const maxX = Math.max(20, df + 15); // Adjust x-axis based on df
    for (let i = 0.1; i <= maxX; i += 0.2) {
      data.push({ x: i.toFixed(1), y: chi2PDF(i, df) });
    }
    return data;
  }, [df]);

  const pValue = 1 - chi2CDF(chiSquareValue, df);
  const isSignificant = pValue < 0.05;

  const handleReset = () => setDf(1);

  return (
    <section className="bg-gray-900/50 p-6 rounded-md border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-cyan-300">
          Why Degrees of Freedom Matters 📈
        </h3>
        <button
          onClick={handleReset}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded-lg text-sm"
        >
          Reset
        </button>
      </div>
      <p className="text-gray-300 mb-4">
        The `df` value defines the shape of the Chi-square curve, which sets the
        standard for what's surprising. Watch how the significance of the same
        Chi-square value (χ² = {chiSquareValue}) changes as you adjust the `df`.
      </p>

      <div className="p-4 bg-gray-800 rounded-lg">
        <label className="block text-center mb-4">
          Degrees of Freedom (df):{" "}
          <span className="font-mono font-bold">{df}</span>
        </label>
        <input
          type="range"
          min="1"
          max="20"
          step="1"
          value={df}
          onChange={(e) => setDf(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />

        <div className="w-full h-80 mt-4">
          <ResponsiveContainer>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
              <XAxis
                dataKey="x"
                stroke="#9ca3af"
                label={{
                  value: "Chi-Square Value",
                  position: "insideBottom",
                  offset: -5,
                  fill: "#9ca3af",
                }}
              />
              <YAxis
                stroke="#9ca3af"
                label={{
                  value: "Probability",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#9ca3af",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #4b5563",
                }}
              />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={false}
              />
              <ReferenceLine
                x={chiSquareValue}
                stroke="#f59e0b"
                strokeWidth={2}
                label={{
                  value: `χ² = ${chiSquareValue}`,
                  fill: "#f59e0b",
                  position: "insideTop",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div
          className={`mt-4 p-4 text-center rounded-lg ${
            isSignificant
              ? "bg-green-900/50 text-green-300"
              : "bg-red-900/50 text-red-300"
          }`}
        >
          <p className="font-bold text-lg">
            At df = {df}, the P-Value is ≈ {pValue.toFixed(3)}
          </p>
          <p>
            {isSignificant
              ? "This is statistically significant!"
              : "This is NOT statistically significant."}
          </p>
        </div>
      </div>

      <p className="mt-4 text-amber-300 font-semibold text-center">
        The `df` sets the correct standard. A higher `df` requires a larger
        Chi-square value to be considered a surprising result.
      </p>
    </section>
  );
};

// section -5 further explanations for degree of freedom

// --- Section 5: The Chi-Square Significance Game ---
const SignificanceGame = () => {
  const [gameMode, setGameMode] = useState("simple"); // 'simple' (df=1) or 'complex' (df=10)
  const [manualScore, setManualScore] = useState(6);
  const [randomScores, setRandomScores] = useState([]);

  const df = gameMode === "simple" ? 1 : 10;
  const criticalValue = gameMode === "simple" ? 3.84 : 18.31; // Chi-square value for p=0.05 at df=1 and df=10

  const chartData = useMemo(() => {
    const data = [];
    const maxX = df === 1 ? 12 : 30;
    for (let i = 0.1; i <= maxX; i += 0.1) {
      data.push({ x: i.toFixed(1), y: chi2PDF(i, df) });
    }
    return data;
  }, [df]);

  const handleGenerateRandom = () => {
    // Generate a random chi-square variate
    let sum = 0;
    for (let i = 0; i < df; i++) {
      sum += Math.pow(randn_bm(0, 1), 2);
    }
    setRandomScores((prev) =>
      [...prev, { score: sum.toFixed(2), isSig: sum > criticalValue }].slice(-5)
    ); // Keep last 5
  };

  const isManualScoreSignificant = manualScore > criticalValue;

  return (
    <section className="bg-gray-900/50 p-6 rounded-md border border-gray-700">
      <h3 className="text-xl font-medium text-cyan-300 mb-4">
        The Chi-Square Significance Game 🎮
      </h3>
      <p className="text-gray-300 mb-4">
        Think of `df` as the difficulty level. A higher `df` makes it harder to
        get a "surprising" result by random chance.
      </p>

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setGameMode("simple")}
          className={`py-2 px-4 rounded-lg font-bold ${
            gameMode === "simple" ? "bg-cyan-500 text-gray-900" : "bg-gray-700"
          }`}
        >
          Play Simple Game (df=1)
        </button>
        <button
          onClick={() => setGameMode("complex")}
          className={`py-2 px-4 rounded-lg font-bold ${
            gameMode === "complex" ? "bg-cyan-500 text-gray-900" : "bg-gray-700"
          }`}
        >
          Play Complex Game (df=10)
        </button>
      </div>

      <div className="p-4 bg-gray-800 rounded-lg">
        <p className="text-center font-semibold">
          {gameMode === "simple"
            ? "In a simple game, the bar for a surprising score is low."
            : "In a complex game, the bar for a surprising score is much higher."}
        </p>
        <div className="w-full h-80 mt-4">
          <ResponsiveContainer>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
              <XAxis
                dataKey="x"
                type="number"
                domain={[0, gameMode === "simple" ? 12 : 30]}
                stroke="#9ca3af"
              />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #4b5563",
                }}
              />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={false}
                animationDuration={500}
              />
              <ReferenceLine
                x={manualScore}
                stroke="white"
                strokeDasharray="3 3"
              />
              <ReferenceArea
                x1={criticalValue}
                x2={gameMode === "simple" ? 12 : 30}
                fill="#991b1b"
                opacity={0.4}
                label={{
                  value: "Surprising Zone",
                  position: "insideTopRight",
                  fill: "#fecaca",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="p-4 bg-gray-800 rounded-lg">
          <h4 className="font-bold text-center mb-2">
            Generate Random Results
          </h4>
          <button
            onClick={handleGenerateRandom}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg mb-2"
          >
            Play a Round 🎲
          </button>
          <div className="text-center text-sm min-h-[120px]">
            <p className="font-semibold">Score History:</p>
            {randomScores.map((s, i) => (
              <p
                key={i}
                className={s.isSig ? "text-green-400" : "text-gray-400"}
              >
                Score: {s.score} -{" "}
                {s.isSig ? "Significant! 🏆" : "Not Significant"}
              </p>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gray-800 rounded-lg">
          <h4 className="font-bold text-center mb-2">Test Your Own Score</h4>
          <label className="block text-center mb-2">
            Manual Score:{" "}
            <span className="font-mono font-bold">
              {manualScore.toFixed(2)}
            </span>
          </label>
          <input
            type="range"
            min="0"
            max={gameMode === "simple" ? 12 : 30}
            step="0.1"
            value={manualScore}
            onChange={(e) => setManualScore(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div
            className={`mt-2 p-3 text-center rounded-lg font-bold text-lg ${
              isManualScoreSignificant
                ? "bg-green-900/50 text-green-300"
                : "bg-red-900/50 text-red-300"
            }`}
          >
            Verdict:{" "}
            {isManualScoreSignificant ? "Significant! 🏆" : "Not Significant"}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Main Page Component ---
export const DegreesOfFreedomPage = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-8 font-sans md:pl-72">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400">
            What are Degrees of Freedom (df)?
          </h1>
          <p className="text-lg text-gray-300 mt-2">
            The number of values in a calculation that are free to vary.
          </p>
        </header>
        <div className="space-y-8">
          <LabTeamSim />
          <GoodnessOfFitSim />
          <ContingencyTableSim />
          <DistributionShifter />
          <SignificanceGame />
        </div>
      </div>
    </div>
  );
};
