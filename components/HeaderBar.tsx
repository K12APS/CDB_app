import React from "react";
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, Alert, Linking } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Calendar from 'expo-calendar';
import { Platform } from "react-native";

import { api } from '../services/api';



const HeaderBar = ({ title }: { title: string }) => {
  console.log(title)
    const colorScheme = useColorScheme();

  const headerStyle =
    colorScheme === "dark" ? styles.headerDark : styles.headerLight;

  const headerTextStyle =
    colorScheme === "dark" ? styles.headerTextDark : styles.headerTextLight;

    const addToCalendar = async () => {
    
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
              "Permesso al calendario negato",
              "Devi abilitare i permessi per il calendario nelle impostazione del telefono.",
              [
                {text: "Annulla", style: "cancel"},
                {text: "Vai alle impostazioni",
                  onPress: () => {
                    if (Platform.OS === 'ios') {
                      Linking.openURL('app-settings:');
                    } else {
                      Linking.openSettings();
                    }
                  }
                }
              ]
            )
            return;
          }
    
          
           const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    
            
            for (const cal of calendars) {
              if (cal.title === "Eventi CoderDojoBrianza") {
                await Calendar.deleteCalendarAsync(cal.id);
              }
            }
    
          const defaultCalendarSource =
        Platform.OS === 'ios'
          ? await getDefaultCalendarSource()
          : { isLocalAccount: true, name: 'CoderdojoBrianza' };
    
        // Crea un calendario personalizzato
      const calendarId = await Calendar.createCalendarAsync({
        title: "Eventi CoderDojoBrianza",
        color: "green",
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.id,
        source: defaultCalendarSource,
        name: "Eventi CoderDojoBrianza",
        ownerAccount: "personal",
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });
    
      const { events: eventi, error } = await api({ size: 15 });
      if(error) {
        console.log(error);
        Alert.alert("Errore", "Impossibile caricare gli eventi. Riprova più tardi.");
        return;
      }
    
      if(eventi.length === 0) {
        Alert.alert("Nessun evento", "Non ci sono eventi da aggiungere al calendario.");
        return;
      }
    
      for(const ev of eventi) {
        try {
          await Calendar.createEventAsync(calendarId, {
          title: ev.name.text,
          startDate: new Date(ev.start.utc),
          endDate: new Date(ev.end.utc),
          timeZone: ev.start.timezone,
          location: ev.venue ? `${ev.venue.address.localized_address_display}` : "Online Event",
        });
        } catch (error) {
          console.log(ev.name.text)
          console.log("Errore durante la creazione dell'evento:", error);
        }
        
      }
    
      Alert.alert(
        "Calendario aggiornato", 
        "Eventi aggiunti al calendario!", 
        [{ text: "OK" }] 
      );
    
      }
    
      async function getDefaultCalendarSource() {
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();
      return defaultCalendar.source;
    }

  return (
    <View style={[headerStyle, styles.container]}>
      <Text style={headerTextStyle}>{title}</Text>
      {title === "Calendario" && (
        <TouchableOpacity 
          style={styles.iconContainer} 
          onPress={addToCalendar}
        >
          <MaterialCommunityIcons name="calendar-plus" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerDark: {
    paddingLeft: 16,
    height: 50,
    fontFamily: "Poppins-SemiBold",
    justifyContent: "center",
    backgroundColor: "#1E1E1E",
  },
  headerLight: {
    paddingLeft: 16,
    height: 50,
    fontFamily: "Poppins-SemiBold",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  headerTextDark: {
    fontSize: 30,
    fontFamily: "Poppins-SemiBold",
    lineHeight: 36,
    includeFontPadding: false,
    textAlignVertical: "center",
    color: "#ffffff",
  },
  headerTextLight: {
    fontSize: 30,
    fontFamily: "Poppins-SemiBold",
    lineHeight: 36,
    includeFontPadding: false,
    textAlignVertical: "center",
    color: "#000",
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
  },
  iconContainer: {
    padding: 8,
  },
});

export default HeaderBar;
