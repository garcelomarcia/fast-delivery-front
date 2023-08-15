import { useState } from "react";

const ControllCountPackages = () => {
  let timerController: any;
  const [stateCountPackages, setStateCountPackages] = useState(1);

  const onClick = (operation: string) => {
    clearTimeout(timerController);
    timerController = setTimeout(() => {
      operation === "more"
        ? setStateCountPackages(stateCountPackages + 1)
        : stateCountPackages >= 2
        ? setStateCountPackages(stateCountPackages - 1)
        : false;
    }, 300);
  };

  const onSubmit = () => {
    return setStateCountPackages(1);
  };

  return {
    onClick,
    onSubmit,
    state: stateCountPackages
  };
};

export default ControllCountPackages;
