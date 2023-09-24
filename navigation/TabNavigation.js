import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import Home from "../screens/Home";
import Colors from "../sharred/Colors";
import Bayar from "../screens/Bayar";

export default function TabNavigation() {
  const Tab = createBottomTabNavigator();
  const styles = StyleSheet.create({
    tabBarStyling: {
      backgroundColor: "#F5F5F5", // Warna latar belakang tab bar
      borderTopWidth: 1, // Ketebalan garis atas tab bar
      borderTopColor: "#E0E0E0", // Warna garis atas tab bar,
      height: 55,
      paddingTop: 6,
    },
    tabLabelStyling: {
      fontSize: 14, // Ukuran teks label
      fontWeight: "bold", // Ketebalan teks label,
      paddingBottom: 5,
    },
  });

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          tabBarStyle: styles.tabBarStyling,
          tabBarLabelStyle: styles.tabLabelStyling,
          tabBarActiveTintColor: Colors.hardGreen, // Warna ikon saat aktif
          tabBarInactiveTintColor: "#8E8E93", // Warna ikon saat tidak aktif
        }}
      />
      <Tab.Screen
        name="Bayar"
        component={Bayar}
        options={{
          tabBarLabel: "Bayar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document" size={size} color={color} />
          ),
          tabBarStyle: styles.tabBarStyling,
          tabBarLabelStyle: styles.tabLabelStyling,
          tabBarActiveTintColor: Colors.hardGreen, // Warna ikon saat aktif
          tabBarInactiveTintColor: "#8E8E93", // Warna ikon saat tidak aktif
        }}
      />
    </Tab.Navigator>
  );
}