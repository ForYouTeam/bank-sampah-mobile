import { useEffect, useRef, useState } from "react"
import { ActivityIndicator, Animated, BackHandler, Dimensions, Easing, Image, Pressable, Text, TextInput, ToastAndroid, View } from "react-native"
import Auth from "../ucase/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Config from "../ucase/Config";
import { useGlobal } from "../store/Global";
import Pembayaran from "../ucase/Pembayaran";
import Profile from "../ucase/Profile";
import Metode from "../ucase/Metode";

const SplashScreenComponent = () => {
  const mainLogo = require('./../assets/icon/main-logo.png')
  
  const logoAnimation = useRef(new Animated.Value(0)).current;
  const formAnimation = useRef(new Animated.Value(0)).current;

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigation = useNavigation();
  const handleChangeValue = (text, type) => {
    if (type === 'username') {
      setUsername(text)
    } else {
      setPassword(text)
    }
  }

  const idrFromat = (number) => {
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    });
  
    return formatter.format(number);
  };

  const { updateProfile, setHistoryPembayaran, setListPayMethod, isLoading, setLoading } = useGlobal()
  const [ newLoading, setNewLoading ] = useState(false)
  const getHistoryList = async () => {
    await Pembayaran.getAllData()
    .then( async (res) => {
      const paymentData = await res.data.data.map(item => {
          const id = item.id.toString(); 
          const bank = item.metode_bayar.metode; 
          const date = item.created_at.split('T')[0];
          const time = item.created_at.split('T')[1].split('.')[0]; 
          const amount = item.jumlah_bayar;
          const status = item.konfirmasi === 1;
      
          return { id, bank, date, time, amount, status };
      });
      
      setHistoryPembayaran(paymentData)
    })
    .catch((err) => {
      ToastAndroid.showWithGravity(
        'Server dalam perbaikan, coba lagi nanti',
        ToastAndroid.LONG,
        ToastAndroid.CENTER
        );
    })
  }

  const getProfile = async () => {
    await Profile.getAllData()
    .then((res) => {
      updateProfile(res.data.data)
    })
    .catch((err) => {

    })
  }

  const getPaymentList = async () => {
    await Metode.getAllData()
    .then((res) => {
      setListPayMethod(res.data.data)
    })
    .catch((err) => {

    })
  }

  const fetchData = async () => {
    setLoading(true)
    
    getHistoryList()

    getProfile()

    getPaymentList()
    setTimeout(() => {
      setLoading(false)
    }, 800);
  };

  const loginProcess = async (payload) => {
    setNewLoading(true)
    await Auth.login({
      username: payload.username,
      password: payload.password
    })
    .then(async(res) => {
      token = res.data.access_token

      await AsyncStorage.setItem('user', token)
      setNewLoading(false)

      await fetchData()
      navigation.navigate('MainHome')
    })
    .catch((err) => {
      setNewLoading(false)
      ToastAndroid.showWithGravity(
        'Username atau password salah',
        ToastAndroid.LONG,
        ToastAndroid.CENTER
        );
    })
  }

  useEffect(() => {
    Config.token()
    .then((res) => {
      if (res) {
        navigation.navigate('MainHome')
      }
    })
    setTimeout(() => {
      Animated.parallel([ // Menggunakan Animated.parallel untuk menjalankan animasi secara bersamaan
        Animated.timing(logoAnimation, {
          toValue: -230,
          useNativeDriver: true,
        }),
        Animated.timing(formAnimation, {
          toValue: -640,
          useNativeDriver: true,
          duration: 300,
          easing: Easing.ease
        }),
      ]).start();
    }, 800);

    const backAction = () => {
      BackHandler
      .exitApp(); // Keluarkan aplikasi
      return true;
    };

    // Tambahkan event listener untuk tombol kembali
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    // Bersihkan event listener saat komponen unmount
    return () => backHandler.remove();
  }, []);

  return (
    <Animated.View className="bg-white relative top-0 pt-[260px] right-2 h-full w-full">
      <Animated.View
       style={{
        transform: [
          {translateY: logoAnimation}
        ]
      }}>
        <View className="flex flex-col items-center">
          <Image className="h-[230px] w-[230px]" source={mainLogo} />
          <Text className="mt-[-80px] text-center ml-6 font-normal text-[12px]">Solusi Hidup Tanpa Sampah</Text>
        </View>
      </Animated.View>
      <Animated.View className="relative w-full bottom-[-490px] left-2 px-10"
      style={{
        transform: [
          {translateY: formAnimation}
        ]
      }}>
        <View>
          <Text className="text-4xl text-gray-700 text-center" style={{ fontFamily: 'Montserrat-Bold' }} >LOGIN</Text>
          <View className="mt-8">
            <Text>Username</Text>
            <TextInput onChangeText={(text) => {handleChangeValue(text, 'username')}} placeholderTextColor={'grey'} className="text-md py-1 border-[2px] mt-2 border-gray-400 px-4 rounded-xl" placeholder="input disini..." />
          </View>
          <View className="mt-4">
            <Text>Password</Text>
            <TextInput onChangeText={(text) => {handleChangeValue(text, 'password')}} secureTextEntry placeholderTextColor={'grey'} className="text-md py-1 border-[2px] mt-2 border-gray-400 px-4 rounded-xl" placeholder="input disini..." />
          </View>
          <View className="mt-8">
            <Pressable disabled={isLoading} onPress={() => {loginProcess({
              username: username,
              password: password
            })}} className="bg-teal-500 py-4 rounded-3xl flex flex-row gap-1 justify-center">
              <Text className="text-center text-white text-md" style={{ fontFamily: 'Montserrat-Bold' }}>Masuk</Text>
              {newLoading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : ''}
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  )
}

export default SplashScreenComponent