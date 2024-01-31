import { Fragment, useState } from "react";
import { CNICVerification } from '../../Components'

const RecoverPassword = () => {
  // const router = useRouter();

  const [step, setStep] = useState(1);

  const stepActionHandler = (data) => {
    if (data === 4) {
      // router.push("/konnector/explore");
      console.log("THis is 4");
    }
    else {
      setStep(data);
    }
  };

  return (
    <Fragment>
      <div >
        {step === 1 && (
          <CNICVerification onStepChange={stepActionHandler} />
        )}
        {step === 2 && (
          <OPTVerification onStepChange={stepActionHandler} />
        )}
        {step === 3 && (
          <PasswordVerification onStepChange={stepActionHandler} />
        )}
      </div>
    </Fragment>
  );
};

export default RecoverPassword;
