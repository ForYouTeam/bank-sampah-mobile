import { FlatList, Image, Text, View } from 'react-native'
import React, { Component } from 'react'
import { Ionicons } from "@expo/vector-icons";
import Colors from '../sharred/Colors';

export default class Home extends Component {
  render() {
    const idrFromat = (number) => {
      const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      });
    
      return formatter.format(number);
    };
  
    const paymentData = [
      { id: '1', bank: 'bri', date: '2023-08-15', time: '12:00 wita', amount: 500000 , status: true  },
      { id: '2', bank: 'bni', date: '2023-08-14', time: '12:00 wita', amount: 25000  , status: false },
      { id: '3', bank: 'bri', date: '2023-08-13', time: '12:00 wita', amount: 300000 , status: true  },
      { id: '4', bank: 'bri', date: '2023-08-13', time: '12:00 wita', amount: 300000 , status: true  },
      { id: '5', bank: 'bni', date: '2023-08-13', time: '12:00 wita', amount: 500000 , status: false },
      { id: '6', bank: 'bri', date: '2023-08-13', time: '12:00 wita', amount: 800000 , status: true  },
      { id: '7', bank: 'bni', date: '2023-08-13', time: '12:00 wita', amount: 100000 , status: true  }, 
    ];

    const renderItem = ({ item }) => (
      <View className="pt-5 flex flex-col mx-2">
        <View>
          <View className="flex flex-row justify-between mb-[-2px]">
            <Text className="mb-2 ml-1 text-gray-500 text-[11px]" style={{ fontFamily: 'Montserrat-Regular' }} >{ item.date }</Text>
            <Text className="mb-2 ml-1 text-gray-500 text-[11px]" style={{ fontFamily: 'Montserrat-Regular' }} >{ item.time }</Text>
          </View>
          <View className="flex flex-row justify-around items-center px-1 py-4 bg-white rounded-lg shadow-md shadow-gray-400">
            <Image resizeMode="contain" className="h-[20px] w-[62px]" source={require(`./../assets/icon/bri.png`)} />
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
      if (paymentData.length >= 1) {
        return (
          <View>
            <FlatList
              data={paymentData}
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

    return (
      <View className="pt-12">
        <View className="flex justify-center px-4">
          <Text className="text-gray-700" style={{ fontFamily: 'Montserrat-Regular' }}>Tagihanmu</Text>
          <Text style={{ fontFamily: 'Montserrat-Medium' }} className="text-left text-3xl text-gray-700">Gufran</Text>
        </View>
        <View className="flex flex-row justify-between items-center mt-7 mx-2 rounded-3xl">
          <View className="flex flex-col flex-grow rounded-l-lg px-4 py-[20px]" style={{backgroundColor: Colors.hardGreen}}>
            <Text style={{ fontFamily: 'Montserrat-Medium' }} className="text-[12px] text-white">Januari</Text>
            <Text style={{ fontFamily: 'Montserrat-SemiBold' }} className="text-xl text-white" >Rp. 200.000</Text>
          </View>
          <View className="flex flex-col rounded-r-lg px-4 py-[32px]" style={{backgroundColor: Colors.orange}}>
            <Text style={{ fontFamily: 'Montserrat-Bold' }} className="text-white text-sm">Belum bayar</Text>
          </View>
        </View>
        <View className="mt-5 h-[514px] pt-6 px-1">
          <Text style={{ fontFamily: 'Montserrat-Bold' }} className="text-xl ml-2 text-gray-700">History Bayar</Text>

          <HistoryPaymentList />

        </View>
        
        <View className="absolute bottom-0 left-0 w-full h-[50px] flex flex-row items-center justify-between px-4 bg-slate-200">
          <Text className="text-[15px] text-gray-500" style={{ fontFamily: 'Montserrat-SemiBold' }} >Total</Text>
          <Text className="text-[15px] text-gray-500" style={{ fontFamily: 'Montserrat-SemiBold' }} >Rp. 1.000.000</Text>
        </View>
      </View>
    )
  }
}