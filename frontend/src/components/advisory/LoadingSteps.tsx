"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

const STEPS = [
  "Checking current conditions",
  "Figuring out how serious it is",
  "Writing advice for shipping companies",
  "Writing advice for trucking companies",
  "Writing advice for the port operator",
];

const STEP_DURATION_MS = 5000;

export function LoadingSteps() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setActiveStep(0);
    const id = setInterval(() => {
      setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }, STEP_DURATION_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-2.5">
      {STEPS.map((step, i) => {
        const done = i < activeStep;
        const current = i === activeStep;
        return (
          <div key={step} className="flex items-center gap-2.5 text-sm">
            {done ? (
              <Check className="h-4 w-4 flex-shrink-0 text-tier-low" strokeWidth={2.5} />
            ) : current ? (
              <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin text-accent" strokeWidth={2.5} />
            ) : (
              <span className="h-4 w-4 flex-shrink-0 rounded-full border border-border" />
            )}
            <span className={done || current ? "text-ink" : "text-ink-faint"}>{step}</span>
          </div>
        );
      })}
      <p className="mt-1 text-xs text-ink-faint">This takes about 20–30 seconds — an AI is thinking through it.</p>
    </div>
  );
}
