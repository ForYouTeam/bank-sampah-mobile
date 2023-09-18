import { FlatList, Image, SafeAreaView, Text, View, ActivityIndicator, RefreshControl, ScrollView } from 'react-native'
import React, { Component, useContext, useEffect, useState } from 'react'
import { Ionicons } from "@expo/vector-icons";
import Colors from '../sharred/Colors';
import { PaymentProcess } from '../services/PaymentProcess';
import Pembayaran from '../ucase/Pembayaran';
import Profile from '../ucase/Profile';
import HomeSkelton from '../skelton/HomeSkelton';

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const idrFromat = (number) => {
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    });
  
    return formatter.format(number);
  };

  const [getProfile, setProfile, isLoading, setLoading, historyPayment, setHistoryPayment, getPayloadForm] = useContext(PaymentProcess)

  const fetchData = async () => {
    setRefreshing(true)
    await Profile.getAllData()
    .then((res) => {
      setProfile({profile: res.data.data})
    })
    .catch((err) => {
      console.log(err);
    })
    
    await Pembayaran.getAllData()
    .then((res) => {
      const paymentData = res.data.data.map(item => {
          const id = item.id.toString(); // Mengonversi ID ke string
          const bank = item.metode_bayar.metode; // Mengambil nama bank
          const date = item.created_at.split('T')[0]; // Mengambil tanggal
          const time = item.created_at.split('T')[1].split('.')[0]; // Mengambil waktu
          const amount = item.jumlah_bayar;
          const status = item.konfirmasi === 1; // Mengubah status menjadi boolean
      
          return { id, bank, date, time, amount, status };
      });
      
      setHistoryPayment(paymentData)
    })
    .catch((err) => {
      console.log(err);
    })
    setTimeout(() => {
      setLoading(false)
    }, 800);
    setRefreshing(false)
  };

  let bulanSekarang = new Date().toLocaleString('id-ID', { month: 'long' });

  const MainView = () => {
    if (!isLoading) {
      return (
        <View className="pt-12">
          <ScrollView 
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchData}
              // Tambahkan deskripsi jika Anda ingin
              title="Pull to refresh"
            />
          } >
            <View className="flex justify-center px-4">
              <Text className="text-gray-700" style={{ fontFamily: 'Montserrat-Regular' }}>Tagihanmu</Text>
              <Text style={{ fontFamily: 'Montserrat-Medium' }} className="text-left text-3xl text-gray-700 uppercase">{ getProfile.profile?.nama ?? '' }</Text>
            </View>
            <View className="flex flex-row justify-between items-center mt-7 mx-2 rounded-3xl">
              <View className="flex flex-col flex-grow rounded-l-lg px-4 py-[20px]" style={{backgroundColor: Colors.hardGreen}}>
                <Text style={{ fontFamily: 'Montserrat-Medium' }} className="text-[13px] text-white">{ bulanSekarang }</Text>
                <Text style={{ fontFamily: 'Montserrat-SemiBold' }} className="text-xl text-white" >{ idrFromat(getProfile.profile?.tagihan ?? 0) }</Text>
              </View>
              <LunasView/>
            </View>
          </ScrollView>
          <SafeAreaView>
            <View className="mt-5 h-[480px] pt-6 px-1">
              <Text style={{ fontFamily: 'Montserrat-Bold' }} className="text-xl ml-2 text-gray-700">History Bayar</Text>
  
              <View className="pb-2">
                <HistoryPaymentList />
              </View>
  
            </View>
          </SafeAreaView>
        </View>
      )
    } else {
      return (
        <HomeSkelton />
      )
    }
  }

  useEffect(() => {
    fetchData(); // Panggil fungsi fetchData di dalam useEffect
  }, []);

  const bankImages = {
    bni: require('./../assets/icon/bni.png'),
    bri: require('./../assets/icon/bri.png'),
  }

  const renderItem = ({ item }) => (
    <View className="pt-5 flex flex-col mx-2">
      <View>
        <View className="flex flex-row justify-between mb-[-2px]">
          <Text className="mb-2 ml-1 text-gray-500 text-[11px]" style={{ fontFamily: 'Montserrat-Regular' }} >{ item.date }</Text>
          <Text className="mb-2 ml-1 text-gray-500 text-[11px]" style={{ fontFamily: 'Montserrat-Regular' }} >{ item.time }</Text>
        </View>
        <View className="flex flex-row justify-around items-center px-1 py-7 bg-white rounded-lg shadow-md shadow-gray-400">
          <Image resizeMode="contain" className="h-[20px] w-[62px]" source={bankImages[item.bank]} />
          <View className="ml-3">
            <Text style={{ fontFamily: 'Montserrat-Regular' }} className="text-[11px]">Total Bayar</Text>
            <Text style={{ fontFamily: 'Montserrat-SemiBold' }} className="text-[16px] mt-[-3px]">{ idrFromat(item.amount) }</Text>
          </View>
          <View className="ml-4">
            <Ionicons name="checkmark-circle" size={29} color={Colors.hardGreen} />
          </View>
        </View>
      </View>
    </View>
  )

  const HistoryPaymentList = () => {
    if (historyPayment) {
      return (
        <View>
          <FlatList
            data={historyPayment}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            />
        </View>
      )
    } else {
      return (
        <View className="flex flex-col items-center justify-center h-[350px]">
          <Image className="w-[260px] h-[260px]" source={require('./../assets/icon/no-transaction.png')} />
          <Text className="text-[12px] mt-[-10px]">Kamu belum pernah melakukan pembayaran!</Text>
        </View>
      );
    }
  };

  const LunasView = () => {
    if (!getProfile.profile?.lunas) {
      return (
        <View className="flex flex-col rounded-r-lg px-4 py-[32px]" style={{backgroundColor: Colors.orange}}>
          <Text style={{ fontFamily: 'Montserrat-Bold' }} className="text-white text-sm">Belum bayar</Text>
        </View>
      )
    } else {
     return (
      <View className="flex flex-col rounded-r-lg px-4 py-[32px]" style={{backgroundColor: Colors.hardGreen}}>
        <Text style={{ fontFamily: 'Montserrat-Bold' }} className="text-white text-sm">Sudah bayar</Text>
      </View>
     )
    }
  }

  return (
    <View>
      <MainView />
    </View>
  )
}

export default Home