const ProgressBar = ({ currentStep, totalSteps = 3 }) => {
  const steps = [
    { number: 1, label: 'Basic Info', icon: '📝' },
    { number: 2, label: 'Email OTP', icon: '📧' },
    { number: 3, label: 'Wallet', icon: '👛' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {/* Desktop/Tablet - Horizontal Steps */}
      <div className="hidden sm:block">
        <ul className="steps steps-horizontal w-full">
          {steps.map((step) => (
            <li
              key={step.number}
              className={`step ${currentStep >= step.number ? 'step-primary' : ''}`}
              data-content={currentStep > step.number ? '✓' : step.number}
            >
              <div className="flex flex-col items-center gap-1 mt-4">
                <span className="text-2xl">{step.icon}</span>
                <span className="text-sm font-medium">{step.label}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile - Vertical Steps */}
      <div className="sm:hidden">
        <ul className="steps steps-vertical">
          {steps.map((step) => (
            <li
              key={step.number}
              className={`step ${currentStep >= step.number ? 'step-primary' : ''}`}
              data-content={currentStep > step.number ? '✓' : step.number}
            >
              <div className="flex items-center gap-2 ml-4">
                <span className="text-xl">{step.icon}</span>
                <span className="text-sm font-medium">{step.label}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Progress percentage */}
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1 opacity-60">
          <span>Progress</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <progress
          className="progress progress-primary w-full"
          value={currentStep}
          max={totalSteps}
        ></progress>
      </div>
    </div>
  );
};

export default ProgressBar;
