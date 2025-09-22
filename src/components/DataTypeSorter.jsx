import React, { useState, useMemo } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

// --- Data for the cards ---
const initialCards = [
  {
    id: "card-1",
    text: "Gram-positive vs. Gram-negative",
    type: "categorical",
  },
  { id: "card-2", text: "15.3 mm inhibition zone", type: "numerical" },
  { id: "card-3", text: "Survived vs. Died", type: "categorical" },
  { id: "card-4", text: "137 Colony Forming Units", type: "numerical" },
  { id: "card-5", text: "Blood Type O", type: "categorical" },
  { id: "card-6", text: "Optical Density 0.6", type: "numerical" },
  { id: "card-7", text: "Treatment A vs. B", type: "categorical" },
  { id: "card-8", text: "25.5°C incubation temp", type: "numerical" },
];

// --- Draggable Card Component ---
const DraggableCard = ({ id, text }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={"bg-gray-700 p-3 rounded-lg shadow-md cursor-grab touch-none"}
    >
      {text}
    </div>
  );
};

// --- Drop Zone Component ---
const DropZone = ({ id, children, type, feedback }) => {
  const { setNodeRef } = useDroppable({ id });

  const feedbackColor =
    feedback === "correct"
      ? "border-green-500"
      : feedback === "incorrect"
      ? "border-red-500"
      : "border-gray-700";

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-900/50 p-4 rounded-lg border-2 ${feedbackColor} transition-colors duration-300 min-h-[200px]`}
    >
      <h3 className="text-xl font-medium mb-4 text-center">
        {type === "categorical" ? "Categorical Data ✅" : "Numerical Data ❌"}
      </h3>
      <p className="text-sm text-gray-400 text-center mb-4">
        {type === "categorical"
          ? "(Good for χ² - These are labels or groups)"
          : "(Not for χ² - These are measurements)"}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
};

// --- Main Sorter Component ---
export const DataTypeSorter = () => {
  const [sortedCards, setSortedCards] = useState({
    categorical: [],
    numerical: [],
  });
  const [feedback, setFeedback] = useState({
    categorical: null,
    numerical: null,
  });

  const unsortedCards = useMemo(
    () =>
      initialCards.filter(
        (card) =>
          !sortedCards.categorical.some((c) => c.id === card.id) &&
          !sortedCards.numerical.some((c) => c.id === card.id)
      ),
    [sortedCards]
  );

  const handleDragEnd = (event) => {
    const { over, active } = event;
    if (!over) return;

    const card = initialCards.find((c) => c.id === active.id);
    const dropZoneId = over.id;

    if (card.type === dropZoneId) {
      // Prevent adding duplicates
      if (!sortedCards[dropZoneId].some((c) => c.id === card.id)) {
        setSortedCards((prev) => ({
          ...prev,
          [dropZoneId]: [...prev[dropZoneId], card],
        }));
      }
      setFeedback({
        [dropZoneId]: "correct",
        [dropZoneId === "categorical" ? "numerical" : "categorical"]: null,
      });
    } else {
      setFeedback({
        [dropZoneId]: "incorrect",
        [dropZoneId === "categorical" ? "numerical" : "categorical"]: null,
      });
    }

    setTimeout(() => setFeedback({ categorical: null, numerical: null }), 500);
  };

  const handleReset = () => {
    setSortedCards({ categorical: [], numerical: [] });
  };

  const allSorted = unsortedCards.length === 0;

  return (
    <section
      id="data-types"
      className="bg-gray-800 p-6 rounded-lg shadow-xl mt-8"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-amber-400 mb-4 border-b-2 border-amber-400/30 pb-2">
          Prerequisite 3: The Right Kind of Data 🧠
        </h2>
        {!allSorted && (
          <button
            onClick={handleReset}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded-lg text-sm"
          >
            Reset
          </button>
        )}
      </div>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid md:grid-cols-3 gap-6 items-start">
          <DropZone
            id="categorical"
            type="categorical"
            feedback={feedback.categorical}
          >
            {sortedCards.categorical.map((card) => (
              <div
                key={card.id}
                className="bg-gray-700 p-3 rounded-lg animate-fade-in"
              >
                {card.text}
              </div>
            ))}
          </DropZone>

          <div className="text-center">
            <h3 className="font-bold mb-2">Unsorted Data</h3>
            <p className="text-sm text-gray-400 mb-4">
              Drag each card to the correct bin.
            </p>
            <div className="space-y-2">
              {unsortedCards.map((card) => (
                <DraggableCard key={card.id} id={card.id} text={card.text} />
              ))}
            </div>
          </div>

          <DropZone
            id="numerical"
            type="numerical"
            feedback={feedback.numerical}
          >
            {sortedCards.numerical.map((card) => (
              <div
                key={card.id}
                className="bg-gray-700 p-3 rounded-lg animate-fade-in"
              >
                {card.text}
              </div>
            ))}
          </DropZone>
        </div>
        {allSorted && (
          <div className="mt-6 bg-gray-900/50 p-6 rounded-md border border-green-500 animate-fade-in text-center">
            <h3 className="text-xl font-semibold text-green-300">
              Excellent! You've mastered the difference.
            </h3>
            <p className="mt-2 text-gray-300 max-w-2xl mx-auto">
              The Chi-square test is all about counting. It counts how many
              items fall into each **category** (like 'Survived' or 'Died'). It
              can't work with **numerical** data because you can't sort a single
              measurement like '15.3 mm' into a group—it *is* the measurement!
            </p>
            <button
              onClick={handleReset}
              className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Reset Demo
            </button>
          </div>
        )}
      </DndContext>
    </section>
  );
};
