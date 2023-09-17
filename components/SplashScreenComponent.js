import { useEffect, useRef } from "react"
import { Animated, Dimensions, Easing, Image, Pressable, Text, TextInput, View } from "react-native"

const SplashScreenComponent = () => {
  const mainLogo = require('./../assets/icon/main-logo.png')
  
  const logoAnimation = useRef(new Animated.Value(0)).current;
  const formAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([ // Menggunakan Animated.parallel untuk menjalankan animasi secara bersamaan
        Animated.timing(logoAnimation, {
          toValue: -230,
          useNativeDriver: true,
        }),
        Animated.timing(formAnimation, {
          toValue: -470,
          useNativeDriver: true,
          duration: 300,
          easing: Easing.ease
        }),
      ]).start();
    }, 800);
  }, []);

  return (
    <Animated.View className="bg-white absolute top-60 right-2 h-full w-full">
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
      <Animated.View className="absolute w-full bottom-0 left-2 px-10"
      style={{
        transform: [
          {translateY: formAnimation}
        ]
      }}>
        <View>
          <Text className="text-4xl text-gray-700 text-center" style={{ fontFamily: 'Montserrat-Bold' }} >LOGIN</Text>
          <View className="mt-8">
            <Text>Username</Text>
            <TextInput placeholderTextColor={'grey'} className="text-md py-1 border-[2px] mt-2 border-gray-400 px-4 rounded-xl" placeholder="input disini..." />
          </View>
          <View className="mt-4">
            <Text>Password</Text>
            <TextInput secureTextEntry placeholderTextColor={'grey'} className="text-md py-1 border-[2px] mt-2 border-gray-400 px-4 rounded-xl" placeholder="input disini..." />
          </View>
          <View className="mt-8">
            <Pressable onPress={() => navigat} className="bg-teal-500 py-4 rounded-3xl">
              <Text className="text-center text-white text-md" style={{ fontFamily: 'Montserrat-Bold' }}>Masuk</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  )
}

export default SplashScreenComponent