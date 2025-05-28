import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { ShadowBox } from 'react-native-neomorph-shadows';

interface ScratchEventCardProps {
  Link: () => void;
  dayEventDate1: string;
  MonthEventDate1: string;
  Title: string;
  Desc: string;
}

const ScratchEventCard = ({ Link, dayEventDate1, MonthEventDate1, Title, Desc }: ScratchEventCardProps) => {
  const apriLink = () => {
    const url = Link;
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  }
    const points = ['Base', 'Guidato', 'Scratch Libero'];
  return (
    <TouchableOpacity style={styles.eventCard} onPress={apriLink}>
              <Text style={styles.eventTitle} allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail">{Title}</Text>
              <View style={styles.eventContent}>
                <View style={styles.DateCard}>
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
                height: 108,
              }}
            >
                    <Text style={styles.numberDate} allowFontScaling={false}>{dayEventDate1}</Text>
                    <Text style={styles.Date} allowFontScaling={false}>{MonthEventDate1.toUpperCase()}</Text>
                    </ShadowBox>
                </View>

                <View style={styles.eventTextContainer}>
                  {/*<Text style={styles.lab} allowFontScaling={false}>Laboratori</Text>*/}
                  <Text style={styles.bulletText} allowFontScaling={false} numberOfLines={5} ellipsizeMode="tail">{Desc}</Text>
                  {/* {points.map((point, index) => (
                    <View style={styles.item} key={index}>
                      <Text style={styles.bullet} allowFontScaling={false}>•</Text>
                      
                    </View>
                  ))} */}
                </View>
              </View>
            </TouchableOpacity>
  );
};

const styles = StyleSheet.create({

    eventCard: {
        backgroundColor: '#f3CB04',
        borderRadius: 30,
        padding: 16,
        paddingTop: 10,
        marginBottom: 20,
        height: 200,
    
        shadowColor: "#000", 
        shadowOffset: {
          width: 0,  // Spostamento orizzontale
          height: 8, // Spostamento verticale
        },
        shadowOpacity: 0.2,  // Ridotta per un effetto più delicato
        shadowRadius: 20,  // Aumentato per un'ombra diffusa
        elevation: 10,  // Elevazione maggiore su Android per ombra più evidente
      },

    eventTitle: {
        fontSize: 32,
        //fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
        fontFamily: 'Poppins-Bold'
      },

      eventContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        //backgroundColor: "#000000"
      },

      DateCard: {
        padding: 0,
        height: 108,
        borderRadius: 30,
        width: 92,
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: '#f3CB04',
      },

      numberDate: {
        marginBottom: -15,
        textAlign: 'center',
        fontSize: 40,
        color: "#ffffff",
        fontFamily: 'Poppins-Bold'
      },
    
      Date: {
        textAlign: 'center',
        fontSize: 27,
        color: "#ffffff",
        fontFamily: 'Poppins-Bold'
      },

      eventTextContainer: {
        marginLeft: 10,
        flex: 1,
      },

      //// item: {
      ////   flexDirection: 'row',
      ////   alignItems: 'center',
      ////   marginBottom: 5,
      ////   paddingLeft: 10,
      //// },
      //// bullet: {
      ////   marginRight: 10,
      ////   color: "#ffffff",
      ////   fontSize: 15,
      ////   fontFamily: 'Poppidans'
      //// },
    
      bulletText: {
        color: "#ffffff",
        fontSize: 15,
        fontFamily: 'Poppins-Bold'
      },

     // // lab: {
     // //   color: "#ffffff",
      ////   fontWeight: "bold",
      ////   fontSize: 15,
      //// },
});

export default ScratchEventCard;
