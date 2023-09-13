import { ActivityIndicator, Image, Pressable, Text, TextInput, TouchableOpacity, View, Modal, Button } from "react-native";
import React, { Component, useContext, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../sharred/Colors";
import { PaymentProcess } from "../services/PaymentProcess";

const Bayar = () => {

  const [getPayloadForm, setPayloadForm, getIsLoading, setIsLoading, modalVisible, setModalVisible ] = useContext(PaymentProcess)
  const changePayMethod = (payload) => {
    setPayloadForm({ onlinePayment: payload });
  };

  const RenderBody = () => {
    if (getIsLoading) {
      return (
        <View className="h-[800px] w-full absolute top-0 right-0 bg-slate-500 z-10 opacity-80 flex flex-col items-center justify-center">
          <ActivityIndicator size="large" color="white" />
          <Pressable onPress={() => {setIsLoading(false)}} className="mt-3">
            <Text style={{ fontFamily: "Montserrat-Regular" }} className="text-center text-md text-white">
              Batal
            </Text>
          </Pressable>
        </View>
      )
    }
  }

  const RenderEmpty = () => {
    return (
      <View className="flex flex-col h-[800px] w-full top-0 right-0 z-10 justify-center items-center absolute bg-white">
        <Image className="h-[170px] w-[170px]" source={require('./../assets/icon/finish.png')} />
        <Text style={{ fontFamily: "Montserrat-Regular" }} className="text-[15px]">Tidak ada tagihan</Text>
      </View>
    )
  }

  return (
    <View>
      <RenderBody />
      {/* BATASSS */}
      
      

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="top-[170px] flex flex-row justify-center">
          <View className="bg-white rounded-xl h-[270px] w-[250px] items-center pt-4 flex flex-col">
            <Pressable onPress={() => {setModalVisible(false)}} className="absolute right-1 top-1 z-10">
              <Ionicons name="close-circle-outline" size={24} color="grey" />
            </Pressable>
            <Image className="h-[150px] w-[150px] mt-6" source={require('./../assets/icon/success.png')} />
            <Text className="mt-2">Data berhasil diproses</Text>
          </View>
        </View>
      </Modal>

      {/* BATASSS */}
      <View className="p-4 flex flex-row justify-center mt-12">
        <Text
          style={{ fontFamily: "Montserrat-SemiBold" }}
          className="text-lg text-gray-700"
        >
          Buat kode pembayaran
        </Text>
      </View>
      <View className="fex flex-row gap-1 justify-around mt-2 h-[130px]">
        <TouchableOpacity
          onPress={() => changePayMethod(true)}
          className={`bg-slate-400 h-full w-2/5 p-2 rounded-xl shadow-lg shadow-gray-700 border-1 border-gray-900 ${
            !getPayloadForm.onlinePayment ? "opacity-70" : ""
          }`}
          style={{ backgroundColor: Colors.online }}
        >
          <View>
            <Text className="text-md text-white">Transfer</Text>
            <View className="flex flex-row justify-center">
              <Image
                className="h-[80px] w-[80px] mt-2"
                source={require("./../assets/icon/offline.png")}
              />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changePayMethod(false)}
          className={`bg-slate-400 h-full w-2/5 p-2 rounded-xl shadow-lg shadow-gray-700 border-1 border-gray-900 ${
            getPayloadForm.onlinePayment ? "opacity-70" : ""
          }`}
          style={{ backgroundColor: Colors.offline }}
        >
          <View>
            <Text className="text-md text-white">Bayar Dikantor</Text>
            <View className="flex flex-row justify-center">
              <Image
                className="h-[95px] w-[95px] mt-2"
                source={require("./../assets/icon/online.png")}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View className="mt-10 px-4">
        <Text style={{ fontFamily: "Montserrat-Regular" }}>
          Jumlah Tagihan Harus Dibayar
        </Text>
        <View className="flex flex-col gap-2 mt-2 pb-3 pt-1 px-1 pr-3 rounded-xl bg-cyan-500">
          <View className="flex flex-row justify-between">
            <Text style={{ fontFamily: "Montserrat-Regular" }} className="text-[15px] text-white">Total</Text>
            <Text style={{ fontFamily: "Montserrat-Regular" }} className="text-[15px] text-white">Rp. 200.000</Text>
          </View>
          <View className="flex flex-row justify-between">
            <Text style={{ fontFamily: "Montserrat-Regular" }} className="text-[15px] text-white">A.N</Text>
            <Text style={{ fontFamily: "Montserrat-Regular" }} className="text-[15px] text-white">Gufran Gani</Text>
          </View>
          <View className="flex flex-row justify-start">
            <Text style={{ fontFamily: "Montserrat-Regular" }} className="text-[12px] mt-4 text-white">Alamat: Jl. Asam 1, No.25</Text>
          </View>
        </View>
      </View>
      <View className="mt-8 px-3">
        <Text
          className="text-[12px] mb-2 ml-1 text-gray-700"
          style={{ fontFamily: "Montserrat-Regular" }}
        >
          Rekening Pengirim
        </Text>
        <View className="flex flex-row items-center border-2 border-gray-400 px-4 rounded-xl">
          <TextInput
            setPayloadForm={(text) => onChangeText(text)}
            keyboardType="numeric"
            className="appearance-none py-2 pl-1 pr-3 text-gray-700 text-lg"
            placeholderTextColor={"grey"}
            placeholder="Cth: 200.000"
          />
        </View>
      </View>
      <View className="mt-4 px-3">
        <Text
          className="text-[12px] mb-2 ml-1 text-gray-700"
          style={{ fontFamily: "Montserrat-Regular" }}
        >
          Jumlah yang dibayar
        </Text>
        <View className="flex flex-row items-center border-2 border-gray-400 px-4 rounded-xl">
          <Text className="text-lg text-gray-500">Rp.</Text>
          <TextInput
            setPayloadForm={(text) => onChangeText(text)}
            keyboardType="numeric"
            className="appearance-none py-2 pl-1 pr-3 text-gray-700 text-lg"
            placeholderTextColor={"grey"}
            placeholder="Cth: 200.000"
          />
        </View>
      </View>
      <View className="mt-11 flex flex-row justify-center">
        <Pressable onPress={() => {setIsLoading(true); setModalVisible(true)}} className="py-4 w-[200px] rounded-xl bg-teal-500">
          <Text  style={{ fontFamily: "Montserrat-Bold" }} className="text-center text-md text-white">
            Buat Kode Sekarang
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
export default Bayar;
