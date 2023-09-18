import { createContext, useState } from "react";

export const PaymentProcess = createContext();

export const StateProvide = (props) => {
  // const [getPayloadForm, setPayloadForm] = useState({
  //   onlinePayment: true,
  //   jumlah_bayar: 0,
  //   metode_bayar: null,
  //   rekening_kirim: ""
  // });

  const [historyPayment, setHistoryPayment] = useState();

  const [getProfile, setProfile] = useState({
    profile: null,
  });

  const [isLoading, setLoading] = useState(true);

  return (
    <PaymentProcess.Provider
      value={[
        // getPayloadForm,
        // setPayloadForm,
        historyPayment,
        setHistoryPayment,
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
