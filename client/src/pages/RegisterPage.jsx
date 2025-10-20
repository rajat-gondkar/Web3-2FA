import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterStep1 from '../components/register/RegisterStep1';
import RegisterStep2 from '../components/register/RegisterStep2';
import RegisterStep3 from '../components/register/RegisterStep3';

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationData, setRegistrationData] = useState({
    userId: null,
    email: null,
  });
  const navigate = useNavigate();

  const handleStep1Complete = (data) => {
    setRegistrationData(data);
    setCurrentStep(2);
  };

  const handleStep2Complete = () => {
    setCurrentStep(3);
  };

  const handleStep3Complete = () => {
    // Registration complete, redirect to login
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {currentStep === 1 && <RegisterStep1 onNext={handleStep1Complete} />}
      {currentStep === 2 && (
        <RegisterStep2
          userId={registrationData.userId}
          email={registrationData.email}
          onNext={handleStep2Complete}
        />
      )}
      {currentStep === 3 && (
        <RegisterStep3
          userId={registrationData.userId}
          onNext={handleStep3Complete}
        />
      )}
    </div>
  );
};

export default RegisterPage;
