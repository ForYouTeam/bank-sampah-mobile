import { createContext, useState } from "react";

export const PaymentProcess = createContext()

export const StateProvide = (props) => {
  const [getPayloadForm, setPayloadForm] = useState({
    onlinePayment: true,
    ammount: 0,
  });
  const [getIsLoading, setIsLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <PaymentProcess.Provider value={[getPayloadForm, setPayloadForm, getIsLoading, setIsLoading, modalVisible, setModalVisible]}>
      {props.children}
    </PaymentProcess.Provider>
  )
}