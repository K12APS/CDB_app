import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { ShadowBox } from 'react-native-neomorph-shadows';

interface MultilabEventCardProps {
  Link: () => void;
  dayEventDate2: string | number;
  monthEventDate2: string;
  Title: string;
}

const MultilabEventCardInverted = ({ Link, dayEventDate2, monthEventDate2, Title }: MultilabEventCardProps) => {

  const apriLink = () => {
      const url = Link;
      Linking.openURL(url).catch((err) => console.error('An error occurred', err));
    }

  const points = ['Minecraft', 'Python', 'Stampa 3D'];
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
                          shadowOpacity: .7,
                          shadowColor: "#000",
                          shadowRadius: 3,
                          borderRadius: 35,
                          backgroundColor: '#01732b',
                          width: 92,
                          height: 108,
                        }}
                      >
            <Text style={styles.numberDate} allowFontScaling={false}>{dayEventDate2}</Text>
            <Text style={styles.Date} allowFontScaling={false}>{monthEventDate2.toUpperCase()}</Text>
          </ShadowBox>
        </View>
        <View style={styles.eventTextContainer}>
          <Text style={styles.lab} allowFontScaling={false}>Laboratori</Text>
          {points.map((point, index) => (
                    <View style={styles.item} key={index}>
                      <Text style={styles.bullet} allowFontScaling={false}>•</Text>
                      <Text style={styles.bulletText} allowFontScaling={false}>{point}</Text>{/* //TODO modificare la descrizione con quella restituita dalle API */}
                    </View>
                  ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({

  eventCard: {
    backgroundColor: '#01732b',
    borderRadius: 30,
    padding: 16,
    paddingTop: 10,
    marginBottom: 20,
    height: 200,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2, 
    shadowRadius: 20, 
    elevation: 10,
  },

  eventTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    fontFamily: 'Poppins-Bold',
  },

  eventContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  DateCard: {
    padding: 0,
    height: 108,
    borderRadius: 30,
    width: 92,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: '#01732b',
  },

  numberDate: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 40,
    color: "#ffffff",
    fontFamily: 'Poppins-Bold',
    marginBottom: -15,
  },

  Date: {
    textAlign: 'center',
    fontSize: 27,
    color: "#ffffff",
    fontFamily: 'Poppins-Bold',
  },

  eventTextContainer: {
    marginLeft: 10,
    flex: 1,
  },

  lab: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingLeft: 10,
  },
  bullet: {
    marginRight: 10,
    color: "#ffffff",
    fontSize: 15
    //fontFamily: 'Poppins'
  },

  bulletText: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: -5,
  },
});


export default MultilabEventCardInverted;
