import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ShadowBox } from "react-native-neomorph-shadows";


const NoEventFindSmall =() => {
    return (
        <View style={styles.NoEventSmall}>
            <Text style={styles.title} allowFontScaling={false}>Ah....  (っ °Д °;)っ</Text>

            <View style={styles.DateDescriptionContainer}>

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
                            height: 30,
                        }}
                    >
                        <Text style = {styles.NumberDate} allowFontScaling={false}>30 <Text style={styles.MonthDate}>FEB</Text> </Text>
                    </ShadowBox>
                </View>

                <View style={styles.DescriptionTextContainer}>
                    <Text style={styles.TextDescription} allowFontScaling={false}>Nessun evento trovato</Text>
                </View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    NoEventSmall: {
        backgroundColor: '#D9D9D9',
        borderRadius: 30,
        padding: 16,
        paddingTop: 10,
        marginBottom: 20,
        height: 108,
    },

    title: {
        fontSize: 32,
        color: '#000',
        fontFamily: 'Poppins-Bold'
    },

    DateDescriptionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    DateBox: {
        height: 36,
        borderRadius: 30,
        width: 92,
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: '#D9D9D9',
    },

    NumberDate: {
        marginTop: -1,
        fontSize: 24,
        textAlign: "center",
        color: "#000",
        fontFamily: 'Poppins-Bold'
    },

    MonthDate: {
        marginTop: 0,
        fontSize: 15,
        textAlign: "center",
        color: "#000",
        fontFamily: 'Poppins-Bold',
    },

    DescriptionTextContainer: {
        marginLeft: 10,
        flex: 1,
        marginTop: 2,
    },

    TextDescription: {
        fontSize: 15,
        color: "#000",
        paddingLeft: 10,
        paddingTop: -20,
        fontFamily: 'Poppins-SemiBold',
    }
});

export default NoEventFindSmall;