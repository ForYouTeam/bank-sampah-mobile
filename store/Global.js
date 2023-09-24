import { createContext, useContext, useState } from "react"

// Buat konteks untuk profil dan daftar history pembayaran
const GlobalContext = createContext();

// Komponen penyedia konteks
export const GlobalProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    profile_id: 0,
    nama: "",
    jenis_rumah: "",
    kode_jenis: "",
    tagihan: "",
    tegangan: "",
    kelurahan: "",
    alamat: "",
    lunas: false
  });

  const [historyPembayaran, setHistoryPembayaran] = useState();
  const [listPayMethod, setListPayMethod] = useState();
  const [payment, setPayment] = useState({
    profile_id      : 0,
    metode_bayar_id : "",
    jumlah_bayar    : "",
    kode_bayar      : ""
  });

  const [loading, setLoading] = useState(false);
  const [isAuth, setAuth] = useState(false)

  const updateProfile = (payload) => {
    setProfile(payload);
  };

  return (
    <GlobalContext.Provider
      value={{
        profile,
        historyPembayaran,
        updateProfile,
        setHistoryPembayaran,
        loading,
        setLoading,
        listPayMethod,
        setListPayMethod,
        payment,
        setPayment,
        isAuth, 
        setAuth
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook untuk menggunakan state global
export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};