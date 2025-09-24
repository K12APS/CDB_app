import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { ShadowBox } from 'react-native-neomorph-shadows';

interface MultilabEventCardProps {
  Link: () => void;
  dayEventDate2: number | string;
  monthEventDate2: string;
  Title: string;
  ticket: string[];
}

const MultilabEventCard = ({ Link, dayEventDate2, monthEventDate2, Title, ticket }: MultilabEventCardProps) => {

  const ticketMod = ticket.map(t => t.replace(/Scratch\s*/i, '')).join(", ");
  

  const apriLink = () => {
    const url = Link;
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  }

  return (
    <TouchableOpacity style={styles.nextEventCard} onPress={apriLink}>
              <Text style={styles.eventTitle} allowFontScaling={false}numberOfLines={1} ellipsizeMode="tail">{Title}</Text>
              <View style={styles.eventContent}>
                <View style={styles.DateCard1}>
                <ShadowBox
              inner
              useSvg
              style={{
                shadowOffset: {width: 1, height: 5}, 
                shadowOpacity: .7,
                shadowColor: "#000",
                shadowRadius: 3,
                borderRadius: 35,
                backgroundColor: '#01732b',
                width: 92,
                height: 36,
              }}
            >
                    <Text style={styles.numberDateNext} allowFontScaling={false}>{dayEventDate2} <Text style={styles.monthDateNext} allowFontScaling={false}>{monthEventDate2.toUpperCase()}</Text></Text>
                    
                    </ShadowBox>
                </View>
                <Text style={[styles.labNext, { flexShrink: 1 }]} allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail">{ticketMod}</Text> 
              </View>
            </TouchableOpacity>
  );
};

const styles = StyleSheet.create({

    eventTitle: {
        fontSize: 32,
        fontFamily: 'Poppins-Bold',
        color: '#fff',
        marginBottom: 5,
      },
      eventContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        //backgroundColor: "#000000"
      },
    nextEventCard: {
        backgroundColor: '#01732b',
        borderRadius: 30,
        padding: 16,
        paddingTop: 10,
        marginBottom: 20,
        height: 108,
        fontFamily: 'Poppins-Regular'
      },
    
      DateCard1: {
        //padding: 5,
        height: 36,
        borderRadius: 30,
        width: 92,
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: '#01732b',
      },
    
      numberDateNext: {
        marginTop: 0,
        fontSize: 24, 
        textAlign: "center",
        fontFamily: 'Poppins-Bold',
        color: "#fff"
      },
      monthDateNext: {
        marginTop: 0,
        fontSize: 15, 
        textAlign: "center",
        //fontWeight: "bold",
        color: "#fff",
        fontFamily: 'Poppins-Bold'
      },
    
      labNext: {
        fontSize: 15,
        //fontWeight: "bold",
        color: "#fff",
        paddingLeft: 10,
        paddingBottom: 0,
        fontFamily: 'Poppins-Bold',
        marginTop: 0,
      },
});

export default MultilabEventCard;
