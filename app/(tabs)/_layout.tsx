import { Tabs} from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Linking, TouchableOpacity, useColorScheme, Dimensions} from 'react-native';
import { Image } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { usePathname } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const home = require('../../assets/images/home.png');
const home_dark_theme = require('../../assets/images/home_dark_theme.png');
const calendar = require('../../assets/images/calendarIcn.png');
const calendar_dark_theme = require('../../assets/images/calendarIcn_dark_theme.png');
const secondaryIcon = require('../../assets/images/Ellipse.png'); // L'icona che appare solo quando attiva
const user = require('../../assets/images/user.png');
const user_dark_theme = require('../../assets/images/user_dark_theme.png');
const home_focused = require('../../assets/images/home_focused.png');
const calendar_focused = require('../../assets/images/calendarIcn_focused.png');
const user_focused = require('../../assets/images/user_focused.png');
const calendar_dark_theme_focused = require('../../assets/images/calendarIcn_focused_dark_theme.png');
const home_dark_theme_focused = require('../../assets/images/home_focused_dark.png');
const user_dark_theme_focused = require('../../assets/images/user_focused_dark_theme.png');





export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const sito = () => {
    const url = 'https://www.coderdojobrianza.it/'; 
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  }

  const translateX = useSharedValue(0);
  const tabWidthAnim = useSharedValue(0); // Start with a smaller initial width
  const pathname = usePathname();
  const screenWidth = Dimensions.get('window').width;
  
  const tabWidth = screenWidth / 3;
  const [activeTab, setActiveTab] = useState(pathname);

  useEffect(() => {
    // Reset the tab width first
    tabWidthAnim.value = 0;
    
    // Use a single timeout to delay the animation
    
      tabWidthAnim.value = withTiming(70, {
        duration: 150,
        easing: Easing.out(Easing.cubic)
      })
    setActiveTab(pathname);
  }, [pathname]);

  const animatedTabStyle = useAnimatedStyle(() => {
    return {
      width: tabWidthAnim.value,
    };
  });

  const TabIcon = ({ source, focused }) => {
    return (
    
      <View style={{ alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
        <Animated.View 
          style={[
            { 
              backgroundColor: isDark ? (focused ? '#606060' : '#1E1E1E') :  (focused ? '#fff' : '#d9d9d9'), 
              borderRadius: 40, 
              height: 35, 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: -20,
            },
            
            focused ? animatedTabStyle : { width: 0 } 
          ]}
        >
          <Image
            source={source}
            style={{
              width: 30,
              height: 30,
              marginTop: 0,
              alignSelf: 'center'
            }}
          />
        </Animated.View>
      </View>
    );
  };
  
  return ( 
    
     <View style={{ flex: 1}}> 
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: isDark ? '#fff' :'#000',
          tabBarLabelStyle: {zIndex:2, fontFamily: 'Poppins-SemiBold', marginTop: 13, fontSize:11, },
          tabBarIconStyle: {marginTop: -7},
          headerStyle: {
            backgroundColor: isDark ? '#1E1E1E' : '#f2f2f2',
          },
          headerShadowVisible: false,
          headerTintColor: isDark ? '#fff' : '#000',
          headerTitle: "",
          tabBarStyle: {
            backgroundColor: isDark ? '#1E1E1E' : '#f2f2f2',
            height: 75,
            overflow: 'visible',
            elevation: 0,        // Rimuove l'ombra su Android
            shadowOpacity: 0,
            zIndex: 1,
          },
        }}
      >
        
        <Tabs.Screen
          name="eventi"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="calendar"
          options={{
            title: "Calendario",
            headerTitle: "Calendario",
            headerTitleAlign: "center",
            headerTitleStyle: {
              color: isDark ? '#fff' : '#000', // Cambia il colore del testo
              fontSize: 30,  
              fontFamily: 'Poppins-Bold', 
              marginBottom: 0,
            },
            tabBarIcon: ({ focused }) => (
              <TabIcon source={ isDark ? (focused ? calendar_dark_theme_focused : calendar_dark_theme) : (focused ? calendar_focused : calendar) } focused={focused} />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                activeOpacity={1} // Imposta opacità a 1 per evitare il feedback visivo
                style={props.style}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  if (pathname !== "/calendar") {
                    tabWidthAnim.value = 0;
                  }
                  if (props.onPress) props.onPress();
                }}
              >
                {props.children}
              </TouchableOpacity>
            ),
          }}
        />

        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerTitle: "Home",
            headerTitleAlign: "center",
            headerTitleStyle: {
              color: isDark ? '#fff' : '#000', 
              fontSize: 30,  
              fontFamily: 'Poppins-Bold', 
              marginBottom: 0,
            },
            tabBarIcon: ({ focused }) => (
              <TabIcon source={ isDark? ( focused ? home_dark_theme_focused : home_dark_theme) : (focused ? home_focused : home) } focused={focused} />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                activeOpacity={1} 
                style={props.style}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  if (pathname !== "/") {
                    tabWidthAnim.value = 0;
                  }
                  if (props.onPress) props.onPress();
                }}
              >
                {props.children}
              </TouchableOpacity>
            ),
          }}
        />

      <Tabs.Screen
        name="user"
        options={{
          title: "Profilo",
          headerTitle: pathname === "/eventi" ? "Eventi" : "Profilo",
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: isDark ? '#fff' : '#000',
            fontSize: 30,
            fontFamily: "Poppins-Bold",
            marginBottom: 0,
          },
          tabBarIcon: ({ focused }) => (
            <TabIcon source={ isDark ? ( focused ? user_dark_theme_focused : user_dark_theme) : ( focused ? user_focused : user) } focused={focused} />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              activeOpacity={1}
              style={props.style}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                if (pathname !== "/user") {
                  tabWidthAnim.value = 0;
                }
                if (props.onPress) props.onPress();
              }}
            >
              {props.children}
            </TouchableOpacity>
          ),
        }}
      />
      </Tabs>
     </View> 
  );
}
