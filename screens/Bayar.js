import { ActivityIndicator, Button, Image, Modal, Pressable, Text, ToastAndroid, View } from 'react-native'
import Colors from '../sharred/Colors'
import { useGlobal } from '../store/Global'
import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker'
import { useEffect, useState } from 'react'
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import Pembayaran from '../ucase/Pembayaran';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const Bayar = () => {
  const { profile, listPayMethod, payment, setPayment } = useGlobal()
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(listPayMethod[0].id);

  const handleChangeValue = (itemValue) => {
    setSelectedValue(itemValue)
    setPayment({
      profile_id      : profile.profile_id,
      metode_bayar_id : itemValue,
      jumlah_bayar    : profile.tagihan,
      kode_bayar      : generateInvoiceCode().toString()
    })
  }

  const findObject = (payload) => {
    return listPayMethod.find(item => item.id === payload)
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const generateInvoiceCode = () => {
    const currentTimestamp = Math.floor(Date.now() / 1000); // Timestamp dalam satuan detik

    // Konversi timestamp menjadi string
    const timestampString = String(currentTimestamp);
  
    // Generate karakter acak (contoh: ABC123)
    const randomChars = generateRandomCharacters(4); // Panjang karakter acak yang ingin Anda tambahkan
  
    // Gabungkan timestamp dan karakter acak untuk membuat kode invoice
    const invoiceCode = `${timestampString}${randomChars}`;
  
    return invoiceCode;
  }

  const generateRandomCharacters = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomChars = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomChars += characters.charAt(randomIndex);
    }
    return randomChars;
  }

  const navigation = useNavigation();

  const sendPayload = async (payload) => {
    let paymentCode
    let expiredCode
    await AsyncStorage.getItem('payment-code')
    .then((res) => {
      paymentCode = res || null
    })
    
    await AsyncStorage.getItem('expired-code')
    .then((res) => {
      expiredCode = res || null
    })
    
    const thisTime = moment().toISOString()
    if (expiredCode > thisTime) {
      ToastAndroid.showWithGravity(
        'Kamu baru saja membuat kode bayar, Coba lagi nanti',
        ToastAndroid.LONG,
        ToastAndroid.CENTER
        );
    } else {
      setLoading(true)
      setTimeout(async () => {
        await Pembayaran.createOne(payload)
        .then((res) => {
          storeData()
          setModalVisible(true)
        })
        .catch((err) => {
          let status = err.response.status || 500
          if (status === 401) {
            AsyncStorage.setItem('user', '')
            navigation.navigate('Login')
          } else {
            let status = err.response.status || 500
            if (status === 500 || 400) {
              ToastAndroid.showWithGravity(
                'Server dalam perbaikan, coba lagi nanti',
                ToastAndroid.LONG,
                ToastAndroid.CENTER
                );
            }
          }
        })
        setLoading(false)
      }, 100);
    }
  }

  useEffect(() => {
    setPayment({
      profile_id      : profile.profile_id,
      metode_bayar_id : selectedValue,
      jumlah_bayar    : profile.tagihan,
      kode_bayar      : generateInvoiceCode().toString()
    })
  }, [])

  const storeData = async () => {
    await AsyncStorage.setItem('expired-code', moment().add(1, 'minutes').toISOString())
    await AsyncStorage.setItem('payment-code', payment.kode_bayar)
  };

  const copyToClipboard = async (textToCopy) => {
    try {
      await Clipboard.setStringAsync(textToCopy);
      // Menampilkan notifikasi jika teks berhasil disalin ke clipboard
      ToastAndroid.showWithGravity(
        'Teks berhasil disalin ke clipboard ',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      setModalVisible(false)
    } catch (error) {
      console.error('Gagal menyalin teks ke clipboard:', error);
      // Menampilkan notifikasi jika terjadi kesalahan saat menyalin teks ke clipboard
      ToastAndroid.showWithGravity(
        'Gagal menyalin teks ke clipboard',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  };

  const MyModal = () => {
    if(isModalVisible)
    {
      return(
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={toggleModal}
          >
            <View className="absolute top-0 left-0 w-full h-full bg-black opacity-40" />

            <View className="flex flex-row justify-center">
              <View className="bg-white w-[300px] h-[300px] top-[170px] rounded-xl px-3 py-2">
                <Pressable onPress={() => {setModalVisible(false)}} className="absolute right-2 top-2">
                  <Ionicons name="close" size={24} color="grey" />
                </Pressable>
                <View className="py-4 px-2 flex flex-col items-center justify-center h-full w-full">
                  <Image source={require('./../assets/icon/offline.png')} className="h-[110px] w-[110px]" />
                  <View className="my-2 flex flex-col items-center">
                    <Text className="capitalize text-gray-700">{findObject(selectedValue).rekening_terima}</Text>
                    <Text style={{ fontFamily: 'Montserrat-SemiBold' }} className="text-gray-700 text-md">{findObject(selectedValue).rekening}</Text>
                  </View>
                  <Text style={{ fontFamily: 'Montserrat-Regular' }} className="mt-3">Code Bayar</Text>
                  <View className="pt-2 flex flex-row gap-2 items-center">
                    <Text style={{ fontFamily: 'Montserrat-SemiBold' }} className="font-bold text-xl text-gray-700">{payment.kode_bayar}</Text>
                    <Pressable onPress={() => { copyToClipboard(payment.kode_bayar) }}>
                      <Ionicons name="md-copy" size={20} color="grey" />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )
    }
  }

  return (
    <View className="">
      <MyModal />
      {/* TOP AREA */}
      <View className="rounded-b-[35px] px-2 py-2 h-[215px]" style={{backgroundColor: Colors.orange}}>
        <View className="h-[29px] w-[70px] bg-cyan-700 relative rounded-2xl top-[45px] left-[20px] flex flex-row justify-center items-center">
          <View className="flex flex-row justify-center items-center gap-2">
            <View className="h-2 w-2 bg-white rounded-full"></View>
            <Text className="text-white uppercase text-[10px]">Late</Text>
          </View>
        </View>
        <View className="h-[80px] w-full relative top-[55px] lef px-5">
          <Text style={{ fontFamily: 'Montserrat-Bold' }} className="text-[28px] text-white">
            INVOICE
          </Text>
        </View>
      </View>
      <View className="h-[190px] w-full absolute top-[130px] flex flex-row justify-center items-center">
        <View className=" h-[160px] w-[330px] rounded-2xl px-2 py-2 bg-white shadow-2xl border-2 border-gray-100 flex flex-row justify-between">
          <View className="mt-4 ml-3">
            <Text className="text-[12px] text-gray-700 font-normal" style={{ fontFamily: 'Montserrat-SemiBold' }}>A.n</Text>
            <Text className="uppercase text-[21px] text-gray-700 mt-3" style={{ fontFamily: 'Montserrat-Bold' }}>{ profile.nama }</Text>
            <View className="w-[160px]">
              <Text className="text-[12px] mt-1 text-gray-700" style={{ fontFamily: 'Montserrat-Medium' }}>Jl. Asam 1, Lere, Palu Barat, Kota Palu</Text>
            </View>
          </View>
          <View className="bg-slate-100 w-[140px] flex flex-col items-center justify-center rounded-xl">
            {profile.lunas ? (
              <View>
                <Text className="text-gray-500">Lunas</Text>
                <Text className="text-[23px] text-gray-700" style={{ fontFamily: 'Montserrat-Bold', color: Colors.orange }} >200.000</Text>
              </View>
            ) : (
              <View>
                <Text className="text-gray-500">Total</Text>
                <Text className="text-[23px] text-gray-700" style={{ fontFamily: 'Montserrat-Bold', color: Colors.orange }} >200.000</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={{display: profile.lunas ? 'flex' : 'none'}} className="w-full h-[560px] flex flex-col justify-center items-center">
        <Image className="h-[200px] w-[200px]" source={require('./../assets/icon/finish.png')} />
        <Text>Kamu telah membayar bulan ini</Text>
      </View>
      <View style={{display: !profile.lunas ? 'flex' : 'none'}}>
        <View className="mt-[120px]">
          <View className="flex flex-row justify-between px-4">
            <Text className="text-gray-500 text-[15px]" style={{ fontFamily: 'Montserrat-Bold' }} >Detail</Text>
            <Text className="text-gray-500 text-[15px]" style={{ fontFamily: 'Montserrat-Bold' }} >...</Text>
          </View>
          <View className="flex flex-row justify-between px-4 mt-9">
            <Text className="text-gray-900 text-[18px]" style={{ fontFamily: 'Montserrat-SemiBold' }} >Rumah</Text>
            <Text className="text-gray-900 text-[18px] capitalize" style={{ fontFamily: 'Montserrat-SemiBold' }} >{profile.jenis_rumah}</Text>
          </View>
          <View className="flex flex-row justify-between px-4 mt-7">
            <Text className="text-gray-900 text-[18px]" style={{ fontFamily: 'Montserrat-SemiBold' }} >Listrik</Text>
            <Text className="text-gray-900 text-[18px] capitalize" style={{ fontFamily: 'Montserrat-SemiBold' }} >{profile.tegangan} Watt</Text>
          </View>
          <View className="flex flex-row justify-between px-4 mt-7">
            <Text className="text-gray-900 text-[18px]" style={{ fontFamily: 'Montserrat-SemiBold' }} >Kelurahan</Text>
            <Text className="text-gray-900 text-[18px] capitalize" style={{ fontFamily: 'Montserrat-SemiBold' }} >{profile.kelurahan}</Text>
          </View>
        </View>
        <View className="mx-4 mt-7">
          <Text className="font-normal text-red-500 text-[13px]">Aturan penetapan jumlah tagihan anda dapat dilihat pada website kami...</Text>
        </View>
        <View className="flex flex-col justify-center items-center">
          <View className="w-[330px] border-2 mx-3 mt-4 border-gray-300 rounded-xl">
            <Picker
            selectedValue={selectedValue}
            onValueChange={handleChangeValue}>
              {listPayMethod.map((item) => (
                <Picker.Item key={item.id} label={item.metode.toUpperCase()} value={item.id} />
              ))}
            </Picker>
          </View>
          <Pressable disabled={isLoading || profile.lunas} onPress={() => {sendPayload(payment)}} className="mt-5 px-5 py-4 rounded-lg" 
          style={!profile.lunas ? {backgroundColor: Colors.orange} : {backgroundColor: Colors.hardGreen}}>
            {!profile.lunas ? (
            <View className="flex flex-row gap-2">
                <Text className="text-white text-[14px]" style={{ fontFamily: 'Montserrat-SemiBold' }}>BUAT KODE BAYAR</Text>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : ''}
            </View>
            ) : (
              <Text className="text-white text-[14px]" style={{ fontFamily: 'Montserrat-SemiBold' }}>SUDAH BAYAR</Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default Bayar