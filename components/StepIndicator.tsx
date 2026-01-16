import React from 'react';
import { AppStep } from '../types';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: AppStep;
}

const steps = [
  { id: AppStep.INPUT, label: 'Upload' },
  { id: AppStep.ANALYZING, label: 'Analyzing' },
  { id: AppStep.GENERATING, label: 'Designing' },
  { id: AppStep.RESULT, label: 'Studio' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const getStatus = (stepId: AppStep) => {
    const stepOrder = [AppStep.INPUT, AppStep.ANALYZING, AppStep.GENERATING, AppStep.RESULT];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepId);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="flex items-center justify-center w-full mb-8">
      {steps.map((step, index) => {
        const status = getStatus(step.id);
        return (
          <div key={step.id} className="flex items-center">
            <div className={`flex flex-col items-center mx-2 ${status === 'pending' ? 'opacity-40' : 'opacity-100'}`}>
              <div className="mb-2">
                {status === 'completed' && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                {status === 'current' && (
                   currentStep === AppStep.ANALYZING || currentStep === AppStep.GENERATING 
                   ? <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
                   : <Circle className="w-6 h-6 text-red-500 fill-current" />
                )}
                {status === 'pending' && <Circle className="w-6 h-6 text-gray-500" />}
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wider ${status === 'current' ? 'text-red-500' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-0.5 w-8 sm:w-16 mx-2 ${status === 'completed' ? 'bg-green-500' : 'bg-gray-700'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};
