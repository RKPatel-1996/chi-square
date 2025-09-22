import React, { useState } from "react";

// Reusable component for the clickable choice cards
const ChoiceCard = ({ title, example, pathType, onClick }) => (
  <div
    onClick={onClick}
    className="border-2 border-gray-700 rounded-lg p-6 hover:border-cyan-400 hover:bg-gray-800/50 transition-all duration-200 cursor-pointer"
  >
    <p className="font-bold text-lg mb-2">
      <span className="mr-2">{pathType === "correct" ? "✅" : "❌"}</span>
      {title}
    </p>
    <p className="text-sm text-gray-400 italic">e.g., "{example}"</p>
  </div>
);

// Reusable component for the final verdict screen
const VerdictScreen = ({ title, message, onReset }) => (
  <div className="text-center animate-fade-in">
    <h2 className="text-4xl font-bold mb-4">{title}</h2>
    <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">{message}</p>
    <button
      onClick={onReset}
      className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-2 px-6 rounded-lg text-lg"
    >
      Start Over
    </button>
  </div>
);

export const ChiSquareWizardPage = () => {
  const [step, setStep] = useState("intro");

  const handleReset = () => setStep("intro");

  const renderStep = () => {
    switch (step) {
      case "intro":
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Is a Chi-Square Test Right For You?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Answer a few questions to see if your data is suitable.
            </p>
            <button
              onClick={() => setStep("question1")}
              className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-3 px-8 rounded-lg text-xl"
            >
              Start Checklist
            </button>
          </div>
        );

      case "question1":
        return (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-semibold text-center">
              Step 1: What is your research question?
            </h2>
            <ChoiceCard
              title="Find an association or compare proportions between groups."
              example="Is there an association between a bacterium's source (Clinical vs. Environmental) and its antibiotic resistance (Resistant vs. Susceptible)?"
              pathType="correct"
              onClick={() => setStep("question2")}
            />
            <ChoiceCard
              title="Compare the average values (means) of numerical data."
              example="Is the average optical density (OD600) higher in Medium A compared to Medium B?"
              pathType="incorrect"
              onClick={() => setStep("verdict-ttest")}
            />
          </div>
        );

      case "question2":
        return (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-semibold text-center">
              Step 2: What kind of data have you collected?
            </h2>
            <ChoiceCard
              title="Counts of items in distinct categories (frequencies)."
              example="Counting the number of petri dishes with fungal contamination (15) vs. no contamination (85)."
              pathType="correct"
              onClick={() => setStep("question3")}
            />
            <ChoiceCard
              title="Measurements with units (numerical data)."
              example="Measuring the diameter of an inhibition zone in millimeters."
              pathType="incorrect"
              onClick={() => setStep("verdict-data-type")}
            />
          </div>
        );

      case "question3":
        return (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-semibold text-center">
              Step 3: Are your observations independent?
            </h2>
            <ChoiceCard
              title="Each data point comes from a separate, individual source."
              example="Testing 50 separate cell cultures for viability after cryopreservation."
              pathType="correct"
              onClick={() => setStep("question4")}
            />
            <ChoiceCard
              title="Repeated measurements from the same source."
              example="Sampling the same single bacterial culture every hour for 6 hours."
              pathType="incorrect"
              onClick={() => setStep("verdict-independence")}
            />
          </div>
        );

      case "question4":
        return (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-semibold text-center">
              Step 4: Are your expected counts large enough?
            </h2>
            <ChoiceCard
              title="Yes, my sample size is large enough to expect counts of 5 or more in all groups."
              example="My 2x2 table has observed counts like 40, 15, 35, and 18."
              pathType="correct"
              onClick={() => setStep("verdict-success")}
            />
            <ChoiceCard
              title="No, I am studying a rare event with very small counts."
              example="I only found 2 mutants in one group and 1 in another."
              pathType="incorrect"
              onClick={() => setStep("verdict-fisher")}
            />
          </div>
        );

      case "verdict-success":
        return (
          <VerdictScreen
            title="✅ Go for it! A Chi-Square test is suitable."
            message="Your research question, data type, independence, and sample size all meet the necessary assumptions. You can confidently proceed with a Chi-square test of independence or goodness-of-fit."
            onReset={handleReset}
          />
        );

      case "verdict-ttest":
        return (
          <VerdictScreen
            title="❌ Stop! Use a Different Test."
            message="Your question is about comparing mean values, not proportions or associations between categories. A t-test (for two groups) or ANOVA (for more than two groups) is likely the correct tool for this job."
            onReset={handleReset}
          />
        );

      case "verdict-data-type":
        return (
          <VerdictScreen
            title="❌ Stop! Incorrect Data Type."
            message="The Chi-square test works by comparing counts (frequencies) within categories. It cannot be used with continuous numerical measurements like diameter or temperature."
            onReset={handleReset}
          />
        );

      case "verdict-independence":
        return (
          <VerdictScreen
            title="❌ Stop! Observations Aren't Independent."
            message="The Chi-square test assumes that each observation is independent. Repeated measurements on the same subject are not independent. Consider a repeated measures statistical test instead."
            onReset={handleReset}
          />
        );

      case "verdict-fisher":
        return (
          <VerdictScreen
            title="❌ Stop! Use a More Appropriate Test."
            message="Your expected counts are likely too low for a standard Chi-square test, which can make the result unreliable. You should use a Fisher's Exact Test, which is designed specifically for small sample sizes."
            onReset={handleReset}
          />
        );

      default:
        return (
          <VerdictScreen
            title="Something went wrong"
            message="Please restart the wizard."
            onReset={handleReset}
          />
        );
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-8 font-sans md:pl-72 flex items-center justify-center">
      <div className="max-w-3xl mx-auto w-full">{renderStep()}</div>
    </div>
  );
};
