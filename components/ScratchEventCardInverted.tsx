import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { ShadowBox, NeomorphBox } from 'react-native-neomorph-shadows';

interface ScratchEventCardInvertedProps {
  Link: () => void;
  dayEventDate1: string | number;
  MonthEventDate1: string;
  Title: string;
  ticket: string[];
}

const ScratchEventCardInverted = ({ Link, dayEventDate1, MonthEventDate1, Title, ticket }: ScratchEventCardInvertedProps) => {

  const ticketMod = ticket.map(t => t.replace(/Scratch\s*/i, '')).join(", ");

  const apriLink = () => {
    const url = Link;
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  }

    const points = ['Base', 'Guidato', 'Scratch Libero'];
    return (
      <TouchableOpacity style={styles.nextEventCard} onPress={apriLink} >
        <Text style={styles.eventTitle} allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail">{Title}</Text>
        <View style={styles.eventContent}>
          <View style={styles.DateCard1}>
          <ShadowBox
              inner
              useSvg
              style={{
                shadowOffset: {width: 1, height: 5}, 
                shadowOpacity: .5,
                shadowColor: "#000",
                shadowRadius: 3,
                borderRadius: 35,
                backgroundColor: '#f3CB04',
                width: 92,
                height: 30,
              }}
            >
              
              <Text style={styles.numberDateNext} allowFontScaling={false}>{dayEventDate1} <Text style={styles.monthDateNext} allowFontScaling={false}>{MonthEventDate1.toUpperCase()}</Text></Text>
              
              </ShadowBox>
          </View>
          <View style={styles.eventTextContainer}>
            <Text style={[styles.lab, { flexShrink: 1 }]} allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail">{ticketMod}</Text> 
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  const styles = StyleSheet.create({
    nextEventCard: {
      backgroundColor: '#f3CB04',
      borderRadius: 30,
      padding: 16,
      paddingTop: 10,
      marginBottom: 20,
      height: 108,
    },
    eventTitle: {
      fontSize: 32,
      color: '#fff',
      marginBottom: 5,
      fontFamily: 'Poppins-Bold',
    },
    eventContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    DateCard1: {
      height: 36,
      borderRadius: 30,
      width: 92,
      justifyContent: "center",
      alignContent: "center",
      backgroundColor: '#f3CB04',
    },
    numberDateNext: {
      marginTop: -1,
      fontSize: 24,
      textAlign: "center",
      color: "#fff",
      fontFamily: 'Poppins-Bold',
    },
    monthDateNext: {
      marginTop: 0,
      fontSize: 15,
      textAlign: "center",
      color: "#fff",
      fontFamily: 'Poppins-Bold',
    },
    eventTextContainer: {
      marginLeft: 10,
      flex: 1,
      marginTop: 0,
    },
    
    lab: {
      fontSize: 15,
        color: "#fff",
        paddingLeft: 10,
        paddingTop: -20,
        fontFamily: 'Poppins-Bold',
    },
  });

export default ScratchEventCardInverted;
