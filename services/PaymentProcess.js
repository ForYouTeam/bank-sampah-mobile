import { createContext, useState } from "react";

export const PaymentProcess = createContext();

export const StateProvide = (props) => {
  const [getPayloadForm, setPayloadForm] = useState({
    onlinePayment: true,
    ammount: 0,
  });

  const [getHistoryList, setHistoryList] = useState({
    data: [],
  });

  const [getProfile, setProfile] = useState({
    profile: null,
  });

  const [isLoading, setLoading] = useState(true);

  return (
    <PaymentProcess.Provider
      value={[
        getPayloadForm,
        setPayloadForm,
        getHistoryList,
        setHistoryList,
        getProfile,
        setProfile,
        isLoading,
        setLoading,
      ]}
    >
      {props.children}
    </PaymentProcess.Provider>
  );
};
