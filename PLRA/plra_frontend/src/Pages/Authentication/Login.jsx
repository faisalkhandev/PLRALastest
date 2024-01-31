import React,{useState, Fragment} from 'react'
import { LoginPage, LoginOTPVerification  } from '../../Components'
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const stepActionHandler = (data) => {
    if (data === 3) {
      navigate('/')
    }
    else {
      setStep(data);
    }
  };

  

  return (
    <Fragment>
    <div >
      {step === 1 && (
        <LoginPage onStepChange={stepActionHandler} />
      )}
      {step === 2 && (
        <LoginOTPVerification onStepChange={stepActionHandler} />
      )}
    </div>
  </Fragment>
  )
}

export default Login
