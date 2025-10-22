const ProgressBar = ({ currentStep, totalSteps = 3 }) => {
  const steps = [
    { number: 1, label: 'Basic Info' },
    { number: 2, label: 'Email OTP' },
    { number: 3, label: 'Wallet' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex-1 flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center relative">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg z-10 transition-all duration-300 ${
                  currentStep > step.number
                    ? 'bg-green-500 text-white'
                    : currentStep === step.number
                    ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg shadow-accent-primary/50'
                    : 'bg-dark-card border-2 border-zinc-700 text-text-secondary'
                }`}
              >
                {currentStep > step.number ? '✓' : step.number}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  currentStep >= step.number ? 'text-text-primary' : 'text-text-muted'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-4 relative -mt-8">
                <div className="absolute inset-0 bg-zinc-700 rounded-full"></div>
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-500 ${
                    currentStep > step.number
                      ? 'bg-gradient-to-r from-accent-primary to-accent-secondary w-full'
                      : 'w-0'
                  }`}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
