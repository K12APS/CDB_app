//TODO AGGIUNGERE CONTROLLO SALVATAGGIO TOKEN NEL BACKEND E GESTIONE NOTIFICHE CON APP CHIUSA
//!FISSARE IMMAGINE SUPPORTO
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Platform,
  Image,
  RefreshControl,
  useColorScheme,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlassView } from "expo-glass-effect";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import React, { useState, useEffect, useRef } from "react";
import { api } from "../../services/api";
import { blog } from "../../services/blog";

import ScratchEventCard from "../../components/ScratchEventCard";
import MultilabEventCard from "@/components/MultilabEventCard";
import ScratchEventCardInverted from "../../components/EventCardSmall";
import MultilabEventCardInverted from "@/components/EventCardLarge";
import NoEventFindSmall from "@/components/NoEventFindSmall";
import NextSeason from "@/components/NextSeason";

import SmallLoadingCard from "@/components/SmallLoadingCard";
import LargeLoadingCard from "@/components/LargeLoadingCard";
import BlogLoadingCard from "@/components/BlogLoadingCard";

import HeaderBar from "@/components/HeaderBar";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { initializeFirebase } from "../../services/firebase-config"; // Importa la funzione di inizializzazione di Firebase

initializeFirebase();

interface Event {
  name: { text: string };
  description: { text: string };
  url: string;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerWithBackend(token: string) {
  try {
    const response = await fetch(
      "https://api.coderdojobrianza.it:3131/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );
    //console.log('Response status:', response.status);
    if (response.ok) {
      console.log("Token registered with backend successfully");
      return true;
    } else {
      console.error("Failed to register token with backend");
      return false;
    }
  } catch (error) {
    console.error("Error registering with backend:", error);
    return false;
  }
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        console.log(
          "Permission not granted to get push token for push notification!"
        );
        return null;
      }

      // Get project ID
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      if (!projectId) {
        console.error("Project ID not found");
        return null;
      }

      // Get push token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      console.log("Expo Push Token:", token.data);

      // Register with your backend
      if (token.data) {
        console.log("Registering token with backend...");
        await registerWithBackend(token.data);
      }

      return token.data;
    } catch (e) {
      console.error("Error getting push token:", e);
      return null;
    }
  } else {
    console.log("Must use physical device for push notifications");
    return null;
  }
}

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const supportLink = () => {
    const url = "https://www.coderdojobrianza.it/contatti/";
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const ContainerStyle =
    colorScheme === "dark" ? styles.containerDark : styles.containerLight;
  const blogContainerStyle =
    colorScheme === "dark"
      ? styles.blogContainerDark
      : styles.blogContainerLight;
  const lineStyle = colorScheme === "dark" ? styles.lineDark : styles.lineLight;
  const updateStyle =
    colorScheme === "dark" ? styles.updateDark : styles.updateLight;

  const modalContentStyle = isDark
    ? styles.modalContentDark
    : styles.modalContentLight;
  const modalTitleStyle = isDark
    ? styles.modalTitleDark
    : styles.modalTitleLight;
  const modalTextStyle = isDark ? styles.modalTextDark : styles.modalTextLight;

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const [tokenRegistered, setTokenRegistered] = useState(false);
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();
  const registrationInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    const url = response.notification.request.content.data.url;

    if (url) {
      console.log('Apro link:', url);
      Linking.openURL(url); // apre il browser di sistema
    }
  });

  return () => subscription.remove();
}, []);

  // Function to register token with retry logic
  const registerTokenWithRetry = async (token: string) => {
    if (!token) return;

    const success = await registerWithBackend(token);
    if (success) {
      console.log("Token registered successfully, stopping retry attempts");
      setTokenRegistered(true);
      if (registrationInterval.current) {
        clearInterval(registrationInterval.current);
      }
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) {
          setExpoPushToken(token);
          console.log("Push token set:", token);

          // Initial registration attempt
          registerTokenWithRetry(token);

          // Set up interval for retrying every 10 minutes (600000 ms)
          registrationInterval.current = setInterval(() => {
            if (!tokenRegistered) {
              console.log("Retrying token registration...");
              registerTokenWithRetry(token);
            }
          }, 30000);
        }
      })
      .catch((error: any) => {
        setExpoPushToken(`${error}`);
        console.error("Push token error:", error);
      });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      //!! notificationListener.current &&
      //   Notifications.removeNotificationSubscription(notificationListener.current);
      // responseListener.current &&
      //   Notifications.removeNotificationSubscription(responseListener.current);
      // Clear interval on component unmount
      if (registrationInterval.current) {
        clearInterval(registrationInterval.current);
      }
    };
  }, []);

  const [events, setEvents] = useState<Event[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [blogError, setBlogError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const extractDate = (dateString: string) => {
    const match = dateString.match(/(\d+)\s([a-zA-Zà-ù]+)/);
    //console.log('Match result:', dateString, match); // Log per il debug
    if (match) {
      const day = match[1]; // Giorno (numero)
      const month = match[2]; // Mese (es. "dicembre")
      const monthAbbr = month.substring(0, 3); // "dicembre" diventa "dic"
      return { day, month: monthAbbr }; // Restituisce un oggetto con giorno e mese abbreviato
    }
    return { day: null, month: null };
  };

  const extractEventName = (title: string) => {
    const match = title.split("|");
    if (match) {
      return match[0].trim(); // Restituisce solo la parte prima del '|'
    }
    return title; // Se non trova '|', restituisce l'intero titolo
  };

  const fetchEvents = async () => {
    setLoading(true);
    const { events: allEvents, error } = await api({ size: 2 }); // Chiamata alla funzione api
    //console.log(error)

    if (error) {
      //console.log(error);
      setError("Impossibile caricare gli eventi. Riprova più tardi...");
      setLoading(false);
    } else {
      setEvents(allEvents);
      setLoading(false);
      setError(null);
    }
  };

  const fetchBlogs = async () => {
    try {
      const allBlogs = await blog(); // Chiamata per ottenere i blog
      setBlogs(allBlogs);

      setBlogError(null);
    } catch (error) {
      console.log("Errore nel recupero dei blog:", error);
      setBlogError("Impossibile recuperare i blog. Riprova più tardi...");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents(); // Ricarica gli eventi al refresh
    fetchBlogs().finally(() => setRefreshing(false)); // Ricarica gli eventi al refresh
  };

  useEffect(() => {
    fetchEvents();
    fetchBlogs();
  }, []);

  const eventDate1 =
    events.length > 0
      ? extractDate(events[0]?.name?.text)
      : { day: "00", month: "ERR" };
  const eventDate2 =
    events.length > 1
      ? extractDate(events[1]?.name?.text)
      : { day: "00", month: "ERR" };

  const event1Day = eventDate1?.day !== null ? eventDate1.day : "00";
  const event1Month = eventDate1?.month !== null ? eventDate1.month : "ERR";

  const eventName1 =
    events.length > 0 ? extractEventName(events[0]?.name?.text) : "Errore";
  const eventName2 =
    events.length > 1 ? extractEventName(events[1]?.name?.text) : "Errore";

  const ticketLab1 =
    events.length > 0
      ? events[0]?.ticket_classes?.map((ticket) => ticket.name)
      : "Errore";
  const ticketLab2 =
    events.length > 1
      ? events[1]?.ticket_classes?.map((ticket) => ticket.name)
      : "Errore";

  const igPress = () => {
    const url = "https://www.instagram.com/coderdojobrianza/";
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const waPress = () => {
    const url = "https://www.whatsapp.com/channel/0029VaGbRGx9MF8zw7OC0h0d";
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const wa1Press = () => {
    const url = "https://www.whatsapp.com/channel/0029VaFkOKZJUM2agTn0bc3N";
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const openUrl = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const isScratchDayFirst = eventName1.includes("Scratch Day"); // Verifica se 'Scratch Day' è contenuto in eventName1

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isDark ? "#1E1E1E" : "#ffffff" }}
      edges={["top", "left", "right"]}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: isDark ? "#1E1E1E" : "#ffffff" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <StatusBar style={isDark ? "light" : "dark"} />
        <HeaderBar title="Home" />

        <View style={ContainerStyle}>
          {loading ? (
            <>
              <LargeLoadingCard />
              <SmallLoadingCard />
            </>
          ) : error ? (
            <Text style={styles.errorText} allowFontScaling={false}>
              {error}
            </Text>
          ) : (
            <>
              {!events[0] && !events[1] ? (
                <NextSeason />
              ) : (
                <>
                  {/* {isScratchDayFirst ? (
                        <>
                          {events[0] ? (
                            <ScratchEventCard
                              Link={events[0].url}
                              dayEventDate1={eventDate1.day} 
                              MonthEventDate1={eventDate1.month}
                              Title={eventName1}
                              ticket = {ticketLab1}
                            />
                          ) : null}

                          {events[1] ? (
                            <MultilabEventCard
                              Link={events[1].url}
                              dayEventDate2={eventDate2.day}
                              monthEventDate2={eventDate2.month}
                              Title={eventName2}
                              ticket = {ticketLab2}
                            />
                          ) : null}
                        </>
                      ) : (
                        <> 
                         */}
                  {events[0] ? (
                    <MultilabEventCardInverted
                      Link={events[0].url}
                      dayEventDate2={eventDate1.day}
                      monthEventDate2={eventDate1.month}
                      Title={eventName1}
                      ticket={ticketLab1}
                    />
                  ) : null}

                  {events[1] ? (
                    <ScratchEventCardInverted
                      Link={events[1].url}
                      dayEventDate1={eventDate2.day}
                      MonthEventDate1={eventDate2.month}
                      Title={eventName2}
                      ticket={ticketLab2}
                    />
                  ) : null}
                  {/* </> */}
                  {/* )} */}
                </>
              )}
            </>
          )}

          <View style={styles.headerContainer}>
            <View style={lineStyle} />
            <Text style={updateStyle} allowFontScaling={false}>
              Notizie
            </Text>
            <View style={lineStyle} />
          </View>

          {loading ? (
            <>
              <BlogLoadingCard />
              <BlogLoadingCard />
            </>
          ) : blogError ? (
            <Text style={styles.errorText} allowFontScaling={false}>
              {blogError}
            </Text>
          ) : blogs ? (
            <>
              {blogs.map((blogItem, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => openUrl(blogItem.link)}
                  style={styles.touchable}
                >
                  <LinearGradient
                    colors={["#016b27", "#7ac7d9", "#f3cb04"]} // Verde, azzurro, giallo
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientBorder}
                  >
                    <View style={blogContainerStyle}>
                      {" "}
                      //TODO
                      <View style={styles.igTextLogoContainer}>
                        <Text
                          style={styles.igTitleText}
                          allowFontScaling={false}
                        >
                          {blogItem.title}
                        </Text>
                      </View>
                      <Image
                        source={{ uri: blogItem.coverImage }}
                        style={styles.igCard}
                      />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <>
              <Text style={styles.loadingText} allowFontScaling={false}>
                Nessun blog trovato...
              </Text>
            </>
          )}

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <View style={styles.modalContainer}>
              <View style={modalContentStyle}>
                <Text style={modalTitleStyle} allowFontScaling={false}>
                  Supporto
                </Text>
                <Text style={modalTextStyle} allowFontScaling={false}>
                  Hai bisogno di aiuto? Contattaci!
                </Text>

                <View style={styles.supportButton}>
                  <TouchableOpacity
                    style={styles.whatsappButton}
                    onPress={() => {
                      Linking.openURL("https://wa.me/393895892074");
                      setTimeout(() => {
                        closeModal();
                      }, 300); // Ritardo per evitare problemi di chiusura del modal
                    }}
                  >
                    <Text style={styles.buttonText} allowFontScaling={false}>
                      Whatsapp
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.siteButton}
                    onPress={() => {
                      supportLink();
                      setTimeout(() => {
                        closeModal();
                      }, 300); // Ritardo per evitare problemi di chiusura del modal
                    }}
                  >
                    <Text style={styles.buttonText} allowFontScaling={false}>
                      Email
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Text style={styles.closeButtonText} allowFontScaling={false}>
                    Chiudi
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>

      {/*Bottone supporto */}
      <GlassView style={styles.glassView}>
        <TouchableOpacity onPress={openModal}>
          <MaterialIcons
            name="support-agent"
            size={38}
            color={isDark ? "#fff" : "#000"}
          />
        </TouchableOpacity>
      </GlassView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  touchable: {
    marginBottom: 20, // Margine intorno al tocco
  },
  gradientBorder: {
    borderRadius: 30, // Regola il raggio secondo le preferenze
    padding: 4, // Margine tra il gradiente e la card interna
    //height: 165,
  },
  scroll: {
    flexGrow: 1, // Questo assicura che il contenitore cresca e possa scorrere se necessario
    padding: -1, // Spazio attorno ai bordi
    paddingBottom: Platform.select({
      android: 90,
    }),
  },
  containerDark: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    padding: 16,
    fontFamily: "Poppins-Regular",
  },

  containerLight: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
    fontFamily: "Poppins-Regular",
  },

  blogContainerDark: {
    flexDirection: "row",
    backgroundColor: "#292929",
    borderRadius: 27,
    padding: 10,
    overflow: "hidden",
    height: 135,
    alignItems: "center", // Centra verticalmente
  },

  blogContainerLight: {
    flexDirection: "row",
    backgroundColor: "#EDEDED",
    borderRadius: 27,
    padding: 10,
    overflow: "hidden",
    height: 135,
    alignItems: "center", // Centra verticalmente
  },
  // waContainer: {
  //   flexDirection: 'row',
  //   backgroundColor: isDark ? '#656565' : '#EDEDED',
  //   borderRadius: 27,
  //   padding: 10,
  //   overflow: 'hidden',
  //   height: 135,
  //   alignItems: 'center', // Centra verticalmente
  // },

  igCard: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginLeft: 10,
  },
  waCard: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginLeft: 10,
  },

  igTextLogoContainer: {
    flex: 1,
    marginLeft: 10,
  },

  waTextLogoContainer: {
    flex: 1,
    marginLeft: 10,
    paddingLeft: 2,
  },

  igTitleText: {
    fontSize: 20,
    color: "#e1306c", // Colore per richiamare il branding Instagram
    marginBottom: 5,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },

  waTitleText: {
    fontSize: 20,
    color: "#25D366", // Colore per richiamare il branding Instagram
    marginBottom: 5,
    fontFamily: "Poppins-Bold",
  },

  igDescription: {
    fontSize: 11,
    color: "#333", // Colore per la descrizione
    textAlign: "justify",
    marginRight: 15,
    maxHeight: 100,
    maxWidth: 200,
    fontFamily: "Poppins-Bold",
  },

  waDescription: {
    fontSize: 11,
    color: "#333", // Colore per la descrizione
    textAlign: "justify",
    marginRight: 15,
    fontFamily: "Poppins-Bold",
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },

  lineDark: {
    flex: 1,
    height: 1,
    backgroundColor: "#fff", // Colore della linea
    marginHorizontal: 20, // Spazio tra il testo e le linee
    marginBottom: 8, //
  },

  lineLight: {
    flex: 1,
    height: 1,
    backgroundColor: "#000", // Colore della linea
    marginHorizontal: 20, // Spazio tra il testo e le linee
    marginBottom: 8, //
  },

  updateDark: {
    textAlign: "center",
    fontSize: 24,
    color: "#fff",
    paddingBottom: 10,
    fontFamily: "Poppins-SemiBold",
  },

  updateLight: {
    textAlign: "center",
    fontSize: 24,
    color: "#000",
    paddingBottom: 10,
    fontFamily: "Poppins-SemiBold",
  },

  loadingText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
    fontFamily: "Poppins-Regular",
  },
  errorText: {
    fontSize: 20,
    textAlign: "center",
    color: "red",
    marginTop: 20,
    fontFamily: "Poppins-Regular",
  },
  glassView: {
    position: "absolute",
    right: 21,
    height: 56,
    width: 56,
    borderRadius: Platform.select({
      ios: 100,
      android: 100,
    }),
    bottom: Platform.select({
      ios: 90,
      android: 120,
    }),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Platform.select({
      android: "#f3CB04",
    }),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Sfondo scuro trasparente
  },
  modalContentDark: {
    backgroundColor: "#3A3A3A",
    padding: 20,
    borderRadius: 30,
    alignItems: "center",
    width: "80%",
  },

  modalContentLight: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 30,
    alignItems: "center",
    width: "80%",
  },

  modalTitleDark: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },

  modalTitleLight: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },

  modalTextDark: {
    fontSize: 16,
    marginBottom: 20,
    color: "#fff",
  },

  modalTextLight: {
    fontSize: 16,
    marginBottom: 20,
    color: "#000",
  },
  supportButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  whatsappButton: {
    backgroundColor: "#01722B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    minWidth: 100,

    //marginTop: 20,
  },

  siteButton: {
    backgroundColor: "#01722B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginLeft: 20,
    minWidth: 100,
    //marginTop: 20,
  },

  closeButton: {
    backgroundColor: "#FFBE00",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },

  closeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    marginBottom: -2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    marginBottom: -2,
    textAlign: "center",
  },
});
