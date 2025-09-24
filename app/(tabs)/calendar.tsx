import { StyleSheet, View, ScrollView, RefreshControl, useColorScheme, Button, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import { Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import * as Calendar from 'expo-calendar';
import { Platform } from "react-native";

import { api } from '../../services/api';
import ScratchEventCard from '@/components/ScratchEventCard';
import MultilabEventCard from '@/components/MultilabEventCard';
import ScratchEventCardInverted from '@/components/ScratchEventCardInverted';
import NextSeason from '@/components/NextSeason';

const add_calendar_dark_theme = require('../../assets/images/add_calendar_light.png');
const add_calendar_light_theme = require('../../assets/images/add_calendar_dark.png');

interface Event {
    id: string;
    title: string;
}


export default function CalendarScreen() {
    
    const router = useRouter(); 
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const containerStyle = isDark ? styles.containerDark : styles.containerLight;

    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const mesiAbbreviati = ['GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU', 'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'];


    const extractEventName = (title: string) => {
        const match = title.split('|');
        if (match) {
            return match[0].trim();
        }
        return title;
    };

    const extractDay = (date: string) => {
        const eventDateStr = date.split('T')[0];
        if (eventDateStr) {
            //console.log('Giorno: ' + eventDateStr.split('-')[2]);
            return eventDateStr.split('-')[2];
            
        } 
        return '32';
    }

    const extractMonth = (date: string) => {
        const eventDateStr = date.split('T')[0];
        if (eventDateStr) {
            //console.log('Mese: ' + mesiAbbreviati[eventDateStr.split('-')[1] - 1]);
            return eventDateStr.split('-')[1];
        } 
        return '2';
    }
    

    const fetchEvents = async () => {
        setLoading(true);
        const {events: allEvents, error} = await api({size: 30});
        console.log(error);

        if (error) {
            setError('Impossibile caricare gli eventi. Rirpova più tardi...');
            setLoading(false);
        } else {
            console.log('eventi caricati con successo')
            setEvents(allEvents);
            //console.log(allEvents.name);
            setLoading(false);
            setError(null);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchEvents().finally(() => setRefreshing(false));
    };

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
    
      alert("Eventi aggiunti al calendario!");
    
      }
    
      async function getDefaultCalendarSource() {
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();
      return defaultCalendar.source;
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    
    return (
        <ScrollView 
            contentContainerStyle={styles.scroll} 
            showsVerticalScrollIndicator={false} 
            style={{ backgroundColor: isDark ? '#1E1E1E' : '#ffffff' }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <View style={containerStyle}>
                {/* Header con bottone sincronizza */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={addToCalendar}>
                        <Image 
                            source={isDark ? add_calendar_dark_theme : add_calendar_light_theme}
                            style={styles.calendarIcon}
                        />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <Text style={styles.loadingText} allowFontScaling={false}>Caricamento eventi...</Text>
                ) :  error ? (
                    <Text style={styles.loadingText} allowFontScaling={false}>{error}</Text>
                ) : (
                    events.length === 0 ? (
                        <NextSeason />
                    ) : (
                    events.map(event => {
                        const nomeEvento = extractEventName(event.name.text);
                        const isScratchEvent = nomeEvento.includes('Scratch');

                        return (
                            <View key={event.id} style={styles.eventItem}>
                                {isScratchEvent ? (
                                    <ScratchEventCardInverted
                                        Link={event.url}
                                        dayEventDate1={extractDay(event.start.local)}
                                        MonthEventDate1={mesiAbbreviati[extractMonth(event.start.local) - 1]}
                                        Title={nomeEvento}
                                        ticket={event?.ticket_classes?.map(ticket => ticket.name) || []}
                                    />
                                ) : (
                                    <MultilabEventCard
                                        Link={event.url}
                                        dayEventDate2={extractDay(event.start.local)}
                                        monthEventDate2={mesiAbbreviati[extractMonth(event.start.local) - 1]}
                                        Title={nomeEvento}
                                        ticket={event?.ticket_classes?.map(ticket => ticket.name) || []}
                                    />
                                )}
                            </View>
                        );
                    })
                )
                )}
                
                <TouchableOpacity style={styles.addTicketButton} onPress={() => router.push('/eventi')}>
                    <Text style={styles.addTicketTextLight} allowFontScaling={false}>Aggiungi biglietto</Text>
                </TouchableOpacity>
                
                

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    containerDark: {
        flex: 1,
        //alignItems: 'center', //!rimosso per avere la card NextSeason allungate verso i bordi
        justifyContent: 'center',
        backgroundColor: '#1E1E1E',
        padding: 16,
    },
    containerLight: {
        flex: 1,
        //alignItems: 'center', //!rimosso per avere la card NextSeason allungate verso i bordi
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        padding: 16,
    },

    scroll: {
        flexGrow: 1,
        padding: -1,
    },

    loadingText: {
        fontSize: 18,
        fontFamily: 'Poppins-Regular',
    },  
    eventItem: {
        width: '100%',
    },
    
    eventTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },

    addTicketButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        height: 56,
        width: 100,
        backgroundColor: '#f3CB04',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,

        
      },

      addTicketTextLight: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold',
    },

    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end', 
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        width: '100%',
    },
    calendarIcon: {
        width: 24,
        height: 24,
        marginRight: 0, 
    },
});