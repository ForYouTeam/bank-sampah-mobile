import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import Colors from '../sharred/Colors';

const HomeSkelton = () => {
  const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)
  return (
    <View className="mt-8 px-4">
      <View>
        <ShimmerPlaceholder className="mt-8 w-[90px]" />
        <ShimmerPlaceholder className="mt-2 w-[140px] h-[50px]" />
      </View>
      <View className="flex flex-row justify-center mt-12">
        <ShimmerPlaceholder className="w-full h-[90px]">
        </ShimmerPlaceholder>
      </View>
      <View className="mt-8">
        <ShimmerPlaceholder className="mt-8 w-[170px] h-[35px]" />
        <ShimmerPlaceholder className="mt-8 w-full h-[75px]" />
      </View>
    </View>
  );
};

export default HomeSkelton;
