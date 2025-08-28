import { Text, View, StyleSheet, Image, TouchableOpacity, Linking, ScrollView, Modal, useColorScheme, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ScreenContainer, Screen } from 'react-native-screens'; 
import { enableScreens } from 'react-native-screens'; 
import { useNavigation } from 'expo-router';
import React, { useState, useEffect } from 'react';
import * as MailComposer from 'expo-mail-composer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import { Platform } from 'react-native';

enableScreens();

export default function AboutScreen() {

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const containerStyle = isDark ? styles.containerDark : styles.containerLight;
  const modalContentStyle = isDark ? styles.modalContentDark : styles.modalContentLight;
  const modalTitleStyle = isDark ? styles.modalTitleDark : styles.modalTitleLight;
  const modalTextStyle = isDark ? styles.modalTextDark : styles.modalTextLight;
  const badgeTitleStyle = isDark ? styles.badgeTitleDark : styles.badgeTitleLight;

  const [popupVisible, setpopupVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [tempName, setTempName] = useState('');
  const [socialPopUpVisible, setSocialPopUpVisible] = useState(false);

  const openModal = () => {
    setpopupVisible(true);
  };

  const closeModal = () => {
    setpopupVisible(false);
  };

  const openSocialModal = () => {
    setSocialPopUpVisible(true);
  }

  const closeSocialModal = () => {
    setSocialPopUpVisible(false);
  };

  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const savedName = await AsyncStorage.getItem('userName');
      if (savedName !== null) {
        setUserName(savedName);
      }
    } catch (error) {
      console.error('Error loading name:', error);
    }
  };

  const insertName = () => {
    setTempName(userName); // Initialize with current name
    setNameModalVisible(true);
  };

  const askReview = async () => {
  try {
    if (await StoreReview.isAvailableAsync()) {
      await StoreReview.requestReview();
    }
  } catch (e) {
    console.log("Errore:", e);
  }
};


  const saveName = async () => {
    try {
      await AsyncStorage.setItem('userName', tempName);
      setUserName(tempName);
      setNameModalVisible(false);
      Alert.alert('Successo', 'Nome salvato correttamente');
      //chiedi all'utente se vuole lasciare una recensione sull'app (solo iOS)
      if (Platform.OS == 'ios') {
        const reviewAsked = await AsyncStorage.getItem('reviewAsked');  //verifica se ha già risposto alla richiesta
        if (reviewAsked !== 'true') {
        await askReview();
        await AsyncStorage.setItem('reviewAsked', 'true');
        }
      }
    } catch (error) {
      console.error('Error saving name:', error);
      Alert.alert('Errore', 'Non è stato possibile salvare il nome');
    }
  };

  // const sendEmail = async () => {
  //   const isAvailable = await MailComposer.isAvailableAsync();
  //   if (isAvailable) {
  //     await MailComposer.composeAsync({
  //       recipients: ['info@coderdojobrianza.it'],
  //       subject: 'Richiesta di supporto',
  //       body: 'Buongiorno, ho bisogno di aiuto',
  //     });
  //   } else {
  //     alert('Nessuna app di posta disponibile.');
  //   }
  // };

  const supportLink = () => {
    const url = 'https://www.coderdojobrianza.it/contatti/'; 
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  const socialLink = () => {
    const url = 'https://unit.link/coderdojobrianza'; 
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  const prenotaPc = () => {
    const url = 'https://www.coderdojobrianza.it/'; 
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  const navigation = useNavigation();


  return (
    <ScreenContainer style={{ flex: 1 }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Screen>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} style={{ backgroundColor: isDark ? '#1E1E1E' : '#ffffff' }}> 
          <View style={containerStyle}>
            {/* <StatusBar style="light" /> */}

            {/*//*SCHEDA UTENTE*/}
            <View style={styles.userTab}>
              <TouchableOpacity onPress={() => {insertName();}}>
                <Text style={styles.userName} allowFontScaling={false}>
                  {userName ? userName : 'Inserisci il tuo nome'}
                  
                </Text>              
              </TouchableOpacity>
              <View style={styles.infoContainer}>
                <View style={styles.imageContainer}>
                  {/* rimuovere dimensioni con immagine dimensionata correttamente */}
                  <Image style ={{width: 92, height: 92}} source={require('../../assets/images/usrImg.png')} />
                    
                  </View>
                <View style={styles.userInfoContainer}>
                  <Text style={styles.presenze} allowFontScaling={false}>Presenze: </Text>
                  <Text style={styles.labPreferito} allowFontScaling={false}>Laboratorio Preferito: </Text>
                </View>
                <View style={styles.qrCodeContainer}></View>
              </View>
            </View>

            {/*//! FINE SCHEDA UTENTE*/}

            {/*//*BADGE */}
            <Text style={badgeTitleStyle} allowFontScaling={false}>I tuoi Badge</Text>
            <View style={styles.badgeContainer}>
              <View style={styles.badge}></View>
              <View style={styles.badge}></View>
              <View style={styles.badge}></View>
              <View style={styles.badge}></View>
              <View style={styles.badge}></View>
            </View>

            {/*//! FINE BADGE*/}

            {/*//*CONTAINER PRENOTA PC*/}
            <View style={styles.PcAndEventContainer}>
              <TouchableOpacity onPress={supportLink}>
                <View style={styles.supportContainer}> 
                  <Text style={styles.pcText} allowFontScaling={false}>Prenota un PC</Text>
                  <Image style={styles.pcImage} source={require('../../assets/images/PC.png')} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress = {() => navigation.navigate('eventi')}>
                <View style={styles.supportContainer}> 
                  <Text style={styles.pcText} allowFontScaling={false}>I tuoi ticket</Text>
                  <Image style={styles.EventImage} source={require('../../assets/images/calendar.png')} />
                </View>
              </TouchableOpacity>

            </View>

            {/*//*CONTAINER SUPPORTO E SOCIAL*/}
            <View style={styles.supportAndSocialContainer}>
              <TouchableOpacity onPress={openModal}>
                <View style={styles.supportContainer}> 
                  <Text style={styles.supportAndSocialText} allowFontScaling={false}>Supporto</Text>
                  <Image style={styles.supportImage} source={require('../../assets/images/supportImg.png')} />
                </View>
              </TouchableOpacity>
              <View style={styles.space}></View>
              <TouchableOpacity onPress={socialLink}> {/*openSocialModal per aprire il modal social*/}
                <View style={styles.supportContainer}> 
                  <Text style={styles.supportAndSocialText} allowFontScaling={false}>Social</Text>
                  <Image style={styles.socialImage} source={require('../../assets/images/socialImg.png')} />
                </View>
              </TouchableOpacity>
            </View>

            {/*//! FINE CONTAINER SUPPORTO E SOCIAL*/}

            <Modal
              animationType="fade"
              transparent={true}
              visible={popupVisible}
              onRequestClose={closeModal} // Chiude il modal su Android col tasto Indietro
            >
              <View style={styles.modalContainer}>
                <View style={modalContentStyle}>
                  <Text style={modalTitleStyle} allowFontScaling={false}>Supporto</Text>
                  <Text style={modalTextStyle} allowFontScaling={false}>Hai bisogno di aiuto? Contattaci!</Text>

                  <View style ={styles.supportButton}>
                    <TouchableOpacity style={styles.whatsappButton} onPress={() => {
                      Linking.openURL("https://wa.me/393895892074");
                      setTimeout(() => {
                        closeModal();
                      }, 300); // Ritardo per evitare problemi di chiusura del modal
                    }}>
                      <Text style={styles.buttonText} allowFontScaling={false}>Whatsapp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.siteButton} onPress={() => {
                      supportLink();
                      setTimeout(() => {
                        closeModal();
                      }, 300); // Ritardo per evitare problemi di chiusura del modal
                    }}> 
                    
                      <Text style={styles.buttonText} allowFontScaling={false}>Email</Text>
                    </TouchableOpacity>
                    
                    
                  </View>
                  
                  

                  <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    <Text style={styles.closeButtonText} allowFontScaling={false}>Chiudi</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* <Modal
              animationType="fade"
              transparent={true}
              visible={socialPopUpVisible}
              onRequestClose={closeSocialModal} // Chiude il modal su Android col tasto Indietro
            >
              <View style={styles.modalContainer}>
                <View style={modalContentStyle}>
                  <Text style={modalTitleStyle} allowFontScaling={false}>Social</Text>
                  <Text style={modalTextStyle} allowFontScaling={false}>Seguici sui nostri social!</Text>

                  <View style ={styles.supportButton}>
                    <TouchableOpacity style={styles.whatsappButton} onPress={() => {
                      Linking.openURL("https://wa.me/393895892074");
                      setTimeout(() => {
                        closeSocialModal();
                      }, 300); // Ritardo per evitare problemi di chiusura del modal
                    }}>
                      <Text style={styles.buttonText} allowFontScaling={false}>Whatsapp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.siteButton} onPress={() => {
                      socialLink();
                      setTimeout(() => {
                        closeSocialModal();
                      }, 300); // Ritardo per evitare problemi di chiusura del modal
                    }}> 
                    
                      <Text style={styles.buttonText} allowFontScaling={false}>Social</Text>
                    </TouchableOpacity>
                    
                    
                  </View>
                  
                  

                  <TouchableOpacity style={styles.closeButton} onPress={closeSocialModal}>
                    <Text style={styles.closeButtonText} allowFontScaling={false}>Chiudi</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal> */}

            <View style={styles.infoContainer}>
              

            
            <Modal
              animationType="fade"
              transparent={true}
              visible={nameModalVisible}
              onRequestClose={() => setNameModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={modalContentStyle}>
                  <Text style={modalTitleStyle} allowFontScaling={false}>Il tuo nome</Text>
                  <Text style={modalTextStyle} allowFontScaling={false}>Inserisci il tuo nome e cognome:</Text>
                  
                  <TextInput
                    style={styles.nameInput}
                    value={tempName}
                    onChangeText={setTempName}
                    placeholder="Nome Cognome"
                    placeholderTextColor="#999"
                  />
                  
                  <View style={styles.supportButton}>
                    <TouchableOpacity style={styles.saveButton} onPress={saveName}>
                      <Text style={styles.buttonText} allowFontScaling={false}>Salva</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.closeButton} onPress={() => setNameModalVisible(false)}>
                      <Text style={styles.closeButtonText} allowFontScaling={false}>Annulla</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
          </View>
        </ScrollView>
      </Screen>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({

  scroll: {
    flexGrow: 1, // Questo assicura che il contenitore cresca e possa scorrere se necessario
    padding: -1, // Spazio attorno ai bordi
  },
  containerDark: {
      flex: 1,
      backgroundColor: '#1E1E1E',
      padding: 16,
  },

  containerLight: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
},

  userTab: {
    backgroundColor: '#01722B',
    height: 200,
    borderRadius: 30,
    padding: 16,
  }, 
  userName: {
    color: '#ffffff',
    fontSize: 32,
    fontFamily: 'Poppins-Bold'
  },

  beta: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Poppins-Bold'
  },

  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    display: 'flex',
  },
  
  imageContainer: {
    width: 92,
    height: 92,
    borderRadius: 46,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: '#fff',
  },

  userInfoContainer: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignSelf: 'flex-start', 
  },

  presenze: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Poppins-Bold'
  },
  labPreferito: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Poppins-Bold'
  },

  qrCodeContainer: {
    width: 52,
    height: 52,
    position: 'absolute', // Posiziona l'immagine in basso a destra
    bottom: -17, // Distanza dal fondo del contenitore
    right: 5, // Distanza dal lato destro del contenitore\
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden"
  },
  
  badgeTitleDark: {
    fontSize: 20,
    color: '#fff',
    paddingTop: 7,
    paddingBottom: 5,
    fontFamily: 'Poppins-Bold'
  },

  badgeTitleLight: {
    fontSize: 20,
    color: '#000',
    paddingTop: 7,
    paddingBottom: 5,
    fontFamily: 'Poppins-Bold'
  },

  badgeContainer: {
    backgroundColor: "#F3CB04",
    height: 88,
    borderRadius: 30,
    padding: 16,
    display: 'flex',
    overflow: 'hidden',
    flexDirection: "row",
    justifyContent: "space-between",
  },
 
  badge: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    height: 56,
    width: 56,
    borderRadius: 30,
  },

  supportAndSocialContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    overflow: "hidden"
  },

  space: {
    
  },

  supportContainer: {
    width: 170,
    height: 180,
    backgroundColor: "#79C7DA",
    borderRadius: 30,
    padding: 16,
    overflow: "hidden",
  },

  supportAndSocialText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: 'Poppins-Bold'
  },

  pcText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: 'Poppins-Bold'
  },

  supportImage: {
    marginLeft: 20,
    top: 20, //  'top' per spostare l'immagine verso il basso
    left: 15, //  'left' per spostare
  },

  socialImage: {
    marginLeft: 20,
    top: 4, //  'top' per spostare l'immagine verso il basso
    left: -35, //  'left' per spostare
  }, 

  PcAndEventContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 20,
    overflow: "hidden"
  },

  pcImage: {
    marginLeft: 45,
    top: -20, //  'top' per spostare l'immagine verso il basso
    left: -35, //  'left' per spostare
  },

  EventImage: {
    marginLeft: 45,
    top: -10, //  'top' per spostare l'immagine verso il basso
    left: -30, //  'left' per spostare
    transform: [{ rotate: '20deg' }]
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Sfondo scuro trasparente
  },
  modalContentDark: {
    backgroundColor: '#3A3A3A',
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
    width: '80%',
  },

  modalContentLight: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
    width: '80%',
  },

  modalTitleDark: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },

  modalTitleLight: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },

  modalTextDark: {
    fontSize: 16,
    marginBottom: 20,
    color: '#fff',
  },

  modalTextLight: {
    fontSize: 16,
    marginBottom: 20,
    color: '#000',
  },

  supportButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: -2,
    textAlign: 'center',
  },

  whatsappButton: {
    backgroundColor: '#01722B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    minWidth: 100,
    
    //marginTop: 20,
  },

  siteButton: {
    backgroundColor: '#01722B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginLeft: 20,
    minWidth: 100,
    //marginTop: 20,
  }, 

  closeButton: {
    backgroundColor: '#FFBE00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },

  closeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    marginBottom: -2
  },

  nameInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#000',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  
  saveButton: {
    backgroundColor: '#01722B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    minWidth: 100,
   marginRight: 20,
  },
  
});
