import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { ShadowBox, NeomorphBox } from 'react-native-neomorph-shadows';

const NoEvent = () => {
    return (
        <View style={styles.noEventCard}>  
                <Text style={styles.title} allowFontScaling={false}>Ah....  (っ °Д °;)っ</Text>
        
                    <View style={styles.DateAndDescriptionContainer}>
        
                        <View style={styles.DateBox}>
                    
                            <ShadowBox
                                inner
                                useSvg
                                style={{
                                    shadowOffset: {width: 1, height: 5}, 
                                    shadowOpacity: .5,
                                    shadowColor: "#000",
                                    shadowRadius: 3,
                                    borderRadius: 35,
                                    backgroundColor: '#D9D9D9',
                                    width: 92,
                                    height: 108,
                                }}
                            >
                                <Text style = {styles.numberDate} allowFontScaling={false}>30</Text>
                                <Text style = {styles.monthDate} allowFontScaling={false}>FEB</Text>
                            </ShadowBox>
        
                    </View>
        
                    <View style={styles.description}>
        
                        <Text style={styles.textDesc} allowFontScaling={false}>Non hai registrato nessun biglietto, utilizza il tasto + qui sotto per rimediare </Text>
        
                    </View>
                </View>
        
            </View>
    )
}

const styles = StyleSheet.create({
    noEventCard: {
        backgroundColor: '#D9D9D9',
        borderRadius: 30,
        padding: 16,
        marginBottom: 20,
        height: 200,
    
        shadowColor: "black", 
        shadowOffset: {
          width: 0,  // Spostamento orizzontale
          height: 8, // Spostamento vert
        },
        shadowOpacity: 0.1,  // Ridotta per un effetto più delicato
        shadowRadius: 20,  // Aumentato per un'ombra diffusa
        elevation: 5,  // Elevazione maggiore su Android per ombra più evidente
    },
    
    title: {
        fontSize: 32,
        color: '#000',
        fontFamily: 'Poppins-Bold'
    },
    
    DateAndDescriptionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    
    DateBox: {
        padding: 0,
        height: 108,
        borderRadius: 30,
        width: 92,
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: '#D9D9D9',
        
    }, 
    numberDate: {
        marginTop: 10,
        textAlign: 'center',
        fontSize: 40,
        color: "#000",
        fontFamily: "Poppins-Bold",
        marginBottom: -20,
    },
    
    monthDate: {
        textAlign: 'center',
        fontSize: 27,
        color: "#000",
        fontFamily: "Poppins-Bold",
        
    },
    
    description: {
        flex: 1,
        padding: 16,
    },
    
    textDesc: {
        fontSize: 14,
        color: '#000',
        fontFamily: 'Poppins-Bold'
    },


})

export default NoEvent;