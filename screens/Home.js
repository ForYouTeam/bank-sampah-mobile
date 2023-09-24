import { FlatList, Image, SafeAreaView, Text, View, ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity, Pressable, ToastAndroid, Modal } from 'react-native'
import React, { Component, useContext, useEffect, useState } from 'react'
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import Colors from '../sharred/Colors';
import Pembayaran from '../ucase/Pembayaran';
import Profile from '../ucase/Profile';
import Metode from '../ucase/Metode'
import HomeSkelton from '../skelton/HomeSkelton';
import { useGlobal } from '../store/Global';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Auth from '../ucase/Auth';

const Home = () => {
  const idrFromat = (number) => {
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    });
  
    return formatter.format(number);
  };

  const { profile, historyPembayaran, updateProfile, setHistoryPembayaran, loading, setLoading, setListPayMethod } = useGlobal()
  const [newModal, setNewModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const toggleModal = () => {
    setNewModal(!newModal);
  };

  const navigation = useNavigation();
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
      let status = err.response.status || 500
      if (status === 401) {
        AsyncStorage.setItem('user', '')
        navigation.navigate('Login')
      } else {
        ToastAndroid.showWithGravity(
          'Server dalam perbaikan, coba lagi nanti',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
          );
      }
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

  const logout = async () => {
    setLogoutLoading(true)
    Auth.logout()
    .then((res) => {
      AsyncStorage.setItem('user', '')
      
      setTimeout(() => {
        setNewModal(false)
        navigation.navigate('Login')
      }, 100);
    })
    .catch((err) => {
      ToastAndroid.showWithGravity(
        'Server dalam perbaikan, coba lagi nanti',
        ToastAndroid.LONG,
        ToastAndroid.CENTER
        );
        
      setNewModal(false)
      // setLogoutLoading(false)
    })
  }

  useEffect(() => {
    fetchData(); // Panggil fungsi fetchData di dalam useEffect
  }, []);

  let bulanSekarang = new Date().toLocaleString('id-ID', { month: 'long' });

  const MainView = () => {
    if (!loading) {
      return (
        <View className="pt-12">
          <ScrollView 
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchData}
              title="Pull to refresh"
            />
          } >
            <View className="flex flex-row justify-between items-center">
              <View className="flex justify-center px-4">
                <Text className="text-gray-700" style={{ fontFamily: 'Montserrat-Regular' }}>Tagihanmu</Text>
                <Text style={{ fontFamily: 'Montserrat-Medium' }} className="text-left text-3xl text-gray-700 uppercase">{ profile?.nama ?? '' }</Text>
              </View>
              <Pressable onPress={() => {setNewModal(true)}} className="mr-5 mt-1">
                <AntDesign name="logout" size={24} color="red" />
              </Pressable>
            </View>
            <View className="flex flex-row justify-between items-center mt-7 mx-2 rounded-3xl">
              <View className="flex flex-col flex-grow rounded-l-lg px-4 py-[20px]" style={{backgroundColor: Colors.hardGreen}}>
                <Text style={{ fontFamily: 'Montserrat-Medium' }} className="text-[13px] text-white">{ bulanSekarang }</Text>
                <Text style={{ fontFamily: 'Montserrat-SemiBold' }} className="text-xl text-white" >{ idrFromat(profile?.tagihan ?? 0) }</Text>
              </View>
              <LunasView/>
            </View>
          </ScrollView>
          <SafeAreaView>
            <View className="mt-5 h-[480px] pt-6 px-1">
              <View className="flex flex-row justify-between items-center">
                <Text style={{ fontFamily: 'Montserrat-Bold' }} className="text-xl ml-2 text-gray-700">History Bayar</Text>
                <View className="w-[150px] mr-4">
                  <Text style={{ fontFamily: 'Montserrat-Regular' }} className="text-gray-400 text-right text-[12px]">upload bukti bayar</Text>
                </View>
              </View>
  
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
          <TouchableOpacity className="ml-4">
            {item.status ? (
              <Ionicons name="checkmark-circle" size={29} color={Colors.hardGreen} />
            ) : (
              <Feather name="upload-cloud" size={29} color="red" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  const HistoryPaymentList = () => {
    if (historyPembayaran && historyPembayaran.length >= 1) {
      return (
        <View>
          <FlatList
            data={historyPembayaran}
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
    if (!profile?.lunas) {
      return (
        <Pressable onPress={() => {}} className="flex flex-col rounded-r-lg px-4 py-[32px]" style={{backgroundColor: Colors.orange}}>
          <Text style={{ fontFamily: 'Montserrat-Bold' }} className="text-white text-sm">Belum bayar</Text>
        </Pressable>
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
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={newModal}
        onRequestClose={toggleModal}
      >
        <View className="absolute top-0 left-0 w-full h-full bg-black opacity-40" />

        <View className="flex flex-row justify-center">
          <View className="bg-white w-[300px] h-[300px] top-[170px] rounded-xl px-3 py-2">
            <View className="flex flex-col justify-center items-center mt-8">
              <Text style={{ fontFamily: 'Montserrat-Regular' }} className="text-lg">Anda ingin logout ?</Text>
              <Image className="h-[130px] w-[130px] mt-[8px]" source={require('./../assets/icon/logout.png')} />
              <View className="flex flex-row gap-4 justify-around mt-4">
                <Pressable disabled={logoutLoading} onPress={() => {
                  logout()
                }} className="bg-red-500 w-[100px] h-[35px] flex flex-row justify-center items-center rounded-lg">
                  <Text className="text-white">Logout</Text>
                  {logoutLoading ? (
                    <ActivityIndicator className="ml-2" size={16} color="#FFF" />
                    ) : ''}
                </Pressable>
                <Pressable onPress={() => {setNewModal(false)}} className="bg-gray-500 w-[100px] h-[35px] flex flex-col justify-center items-center rounded-lg">
                  <Text className="text-white">Batal</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Home