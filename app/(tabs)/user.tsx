import { Text, View, StyleSheet, Image, TouchableOpacity, Linking, ScrollView, Modal, useColorScheme, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ScreenContainer, Screen } from 'react-native-screens'; 
import { enableScreens } from 'react-native-screens'; 
import { useNavigation } from 'expo-router';
import React, { useState, useEffect, useRef, useMemo, useCallback, use } from 'react';
import * as MailComposer from 'expo-mail-composer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

import { loginUser, registerUser } from '@/utils/authUtils';

import LoginModal from '../../components/loginModal';
import RegisterModal from '../../components/RegisterModal';

import TermsAndConditions from '@/components/Terms';


// import {
//   BottomSheetModal,
//   BottomSheetView,
//   BottomSheetModalProvider,
// } from '@gorhom/bottom-sheet';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { Portal } from '@gorhom/portal';


import HeaderBar from "@/components/HeaderBar";
import axios from 'axios';
// import { SlideOutDown } from 'react-native-reanimated';


enableScreens();



export default function AboutScreen() {
//! da spostare in un file separato che verifica prima di tutto se l'utente è loggato 


  const loadInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if(!token) {
          await AsyncStorage.setItem('userName', 'Accedi/registrati');
          return false;
        }

        const response = await axios.get('https://api.coderdojobrianza.it:3000/loadInfo', {
          headers: { Authorization: `${token}` }
        });

        if (response.status !== 200) {
          await AsyncStorage.setItem('userName', 'Accedi/registrati');
          return false;
        }

        if (response.headers['x-new-token']) {
          await AsyncStorage.setItem('token', response.headers['x-new-token']);
        }
        setUserName(response.data.user.nome);
        await AsyncStorage.setItem('userName', response.data.user.nome);
        return true;
      } catch (error) {
        console.error(error);
        await AsyncStorage.setItem('userName', 'Accedi/registrati');
      }
    };

    useEffect(() => {
      loadInfo(); // chiama la funzione async
  }, []);

  // Tema chiaro/scuro
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const containerStyle = isDark ? styles.containerDark : styles.containerLight;
  const modalContentStyle = isDark ? styles.modalContentDark : styles.modalContentLight;
  const modalTitleStyle = isDark ? styles.modalTitleDark : styles.modalTitleLight;
  const modalTextStyle = isDark ? styles.modalTextDark : styles.modalTextLight;
  const badgeTitleStyle = isDark ? styles.badgeTitleDark : styles.badgeTitleLight;

  // Stati per i vari popup/modal
  const [popupVisible, setpopupVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const { userName, reloadUser, setUserName } = useContext(UserContext);
  const {isLogged, setIsLogged} = useContext(UserContext);
  const [tempName, setTempName] = useState('');
  const [socialPopUpVisible, setSocialPopUpVisible] = useState(false);
  const [loginPopupVisible, setLoginPopupVisible] = useState(false);
  const [registerPopupVisible, setRegisterPopupVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  // const [termsPopupVisible, setTermsPopupVisible] = useState(false);

  // Funzioni per aprire/chiudere i modali
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

  // Carica il nome salvato localmente all'avvio
  useEffect(() => {
     reloadUser();
  }, []);

  // const loadUserName = async () => {
  //   try {
  //     const savedName = await AsyncStorage.getItem('userName');
  //     if (savedName !== null) {
  //       setUserName(savedName);
  //     }
  //   } catch (error) {
  //     console.error('Error loading name:', error);
  //   }
  // };

  // Gestione modale nome
  const insertName = () => {
    setTempName(userName); // imposta il nome temporaneo
    setNameModalVisible(true);
  };

  // Mostra il modale login
  const login = () => {
    setLoginPopupVisible(true);
  }

// // ref
//   const bottomSheetModalRef = useRef<BottomSheetModal>(null);

//   // callbacks
//   const handlePresentModalPress = useCallback(() => {
//     bottomSheetModalRef.current?.present();
//   }, []);
//   const handleSheetChanges = useCallback((index: number) => {
//     console.log('handleSheetChanges', index);
//   }, []);

  // Funzione login
  // const loginUser = () => {

  //   setEmail(email.trim().toLowerCase());
    
  //   if(!email || !password) {
  //     setAuthStatus('Compila tutti i campi');
  //     setAuthColor('red');
  //     return;
  //   }

  //   if(!verifyEmail(email)) {
  //     setAuthStatus('Inserisci un indirizzo email valido.');
  //     setAuthColor('red');
  //     return;
  //   }


  //   try {
  //     axios.post('https://api.coderdojobrianza.it:3000/login', {
  //       email: email,
  //       password: password
  //     })
  //     .then(async (response) => {

  //       await AsyncStorage.setItem('token', response.data.token);
  //       setIsLogged(true);
  //       console.log(isLogged);

  //       setAuthStatus('Login effettuato con successo!');
  //       setAuthColor('green');


  //       // nascondi il messaggio dopo 2 secondi e chiudi il popup
  //       setTimeout(() => {
  //         setLoginPopupVisible(false);
  //         setAuthStatus(null);
  //         setEmail('');
  //         setPassword('');
  //       }, 2000);

  //       loadInfo();
  //     })
  //     .catch(error => {
  //       if(error.response && error.response.status === 401) {
  //       setAuthStatus('Email o password errati.');
  //       setAuthColor('red');
  //       } else {
  //         setAuthStatus('Si è verificato un errore durante il login.');
  //         setAuthColor('red');
  //       }

  //     });
  //   } catch (error) {
      
  //   }
  // }

   

  // //funzione verifica email
  // const verifyEmail = (email: string) => {
  //   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  //   return regex.test(email);
  // };

  // //funzione verifica password
  // const verifyPassword = (password: string) => {
  //   const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,25}$/; //minimo 10 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale massimo 25 caratteri
  //   return regex.test(password);
  // }

  // Funzione registrazione
  // const registerUser = () => {
  //   console.log('nome:', nome);
  //   console.log('cognome:', cognome);
  //   console.log('email:', email);
  //   console.log('password:', password);

  //   setEmail(email.trim().toLowerCase());
  //   setNome(nome.trim());
  //   setCognome(cognome.trim());

  //   //verifica lunghezza campi
  //   if(nome.length < 2 || cognome.length < 2) {
  //     setAuthStatus('Nome e cognome devono contenere almeno 2 caratteri.');
  //     setAuthColor('red');
  //     return;
  //   }

  //   //verifica inserimento campi
  //   if(!nome || !cognome || !email || !password) {
  //     setAuthStatus('Compila tutti i campi');
  //     setAuthColor('red');
  //     return;
  //   }

  //   //verifica email valida
  //   if(!verifyEmail(email)) {
  //     setAuthStatus('Inserisci un indirizzo email valido.');
  //     setAuthColor('red');
  //     return;
  //   }

  //   //verifica password
  //   //!! if(!verifyPassword(password)) {
  //   //   console.log('password non valida');
  //   //   setAuthStatus('La password deve contenere almeno 10 caratteri, una lettera maiuscola, una minuscola, un numero e un carattere speciale.');
  //   //   setAuthColor('red');
  //   //   return;
  //   // }

  //   //verifica conferma password
  //   if(password !== passwordConfirm) {
  //     setAuthStatus('Le password non corrispondono.');
  //     setAuthColor('red');
  //     return;
  //   }

  //   //verifica accettazione termini
  //   if(!TermsAccepted) {
  //     setAuthStatus('Devi accettare i termini e condizioni.');
  //     setAuthColor('red');
  //     return;
  //   }

  //   axios.post('https://api.coderdojobrianza.it:3000/register', {
  //     nome: nome,
  //     cognome: cognome,
  //     email: email,
  //     password: password,
  //   })

  //   .then(async (response) => {
  //     await AsyncStorage.setItem('token', response.data.token);
  //     console.log(response.data);
  //     console.log(await AsyncStorage.getItem('token'));
  //     loadInfo();
  //     setIsLogged(true);
  //     // Svuota i campi dopo la registrazione
  //     setPassword('');
  //     setEmail('');
  //     setCognome('');
  //     setNome('');
  //     setPasswordConfirm('');
  //     setTermsAccepted(false);

  //     setAuthStatus('Login effettuato con successo!');
  //     setAuthColor('green');

  //     // nascondi il messaggio dopo 2 secondi e chiudi il popup
  //     setTimeout(() => {
  //       setRegisterPopupVisible(false);
  //       setAuthStatus(null);
        
  //     }, 2000);
  //   })
  //   .catch(error => {
  //     if (error.response && error.response.status === 409) {
  //       setAuthStatus('Questa email è già registrata');
  //     } else {
  //       setAuthStatus('Si è verificato un errore durante la registrazione');
  //     }
  //   });
  // }

  // Chiede una recensione sull'App (solo iOS)
  const askReview = async () => {
  try {
    if (await StoreReview.isAvailableAsync()) {
      await StoreReview.requestReview();
    }
  } catch (e) {
    console.log("Errore:", e);
  }
};

  // Salvataggio nome utente su AsyncStorage
  const saveName = async () => {
    try {
      await AsyncStorage.setItem('userName', tempName);
      setUserName(tempName);
      setNameModalVisible(false);
      Alert.alert('Successo', 'Nome salvato correttamente');
      // Richiesta recensione solo alla prima volta
      if (Platform.OS == 'ios') {
        const reviewAsked = await AsyncStorage.getItem('reviewAsked');
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

  // Link di supporto
  const supportLink = () => {
    const url = 'https://www.coderdojobrianza.it/contatti/'; 
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  // Link ai social
  const socialLink = () => {
    const url = 'https://unit.link/coderdojobrianza'; 
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  // Link prenotazione PC
  const prenotaPc = () => {
    const url = 'https://www.coderdojobrianza.it/'; 
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  // Invio mail di supporto
  const mail = () => {
    MailComposer.composeAsync({
      recipients: ['info@coderdojobrianza.it'],
      subject: 'Richiesta di supporto',
      body: 'Buongiorno, ho bisogno di aiuto',
    });
  };

  const navigation = useNavigation();

  // RENDER DELLA PAGINA
  return (
    // <GestureHandlerRootView>
    //   <BottomSheetModalProvider>
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#1E1E1E' : '#ffffff' }} edges={['top', 'left', 'right']}>
      
    <ScreenContainer style={{ flex: 1, backgroundColor: isDark ? '#1E1E1E' : '#ffffff' }}> 
      
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Screen style={{ flex: 1 }}> 

        <ScrollView 
          contentContainerStyle={styles.scroll} 
          showsVerticalScrollIndicator={false} 
          style={{ flex: 1 }} 
        > 
        <HeaderBar title="Profilo" />
          <View style={containerStyle}>

            {/* SCHEDA UTENTE */}
            <View style={styles.userTab}>
              <TouchableOpacity onPress={() => {login()}}>
                <Text style={styles.userName} allowFontScaling={false}>
                  {userName ? userName : 'Accedi/registrati'}
                </Text>              
              </TouchableOpacity>
              <View style={styles.infoContainer}>
                <View style={styles.imageContainer}>
                  <Image style ={{width: 92, height: 92}} source={require('../../assets/images/usrImg.png')} />
                  </View>
                <View style={styles.userInfoContainer}>
                  <Text style={styles.presenze} allowFontScaling={false}>Presenze: </Text>
                  <Text style={styles.labPreferito} allowFontScaling={false}>Laboratorio Preferito: </Text>
                </View>
                <View style={styles.qrCodeContainer}></View>
              </View>
            </View>

            {/* BADGE UTENTE */}
            <Text style={badgeTitleStyle} allowFontScaling={false}>I tuoi Badge</Text>
            <View style={styles.badgeContainer}>
              <View style={styles.badge}></View>
              <View style={styles.badge}></View>
              <View style={styles.badge}></View>
              <View style={styles.badge}></View>
              <View style={styles.badge}></View>
            </View>

            {/* SEZIONE PRENOTAZIONI */}
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

            {/* SEZIONE SUPPORTO E SOCIAL */}
            <View style={styles.supportAndSocialContainer}>
              <TouchableOpacity onPress={openModal}>
                <View style={styles.supportContainer}> 
                  <Text style={styles.supportAndSocialText} allowFontScaling={false}>Supporto</Text>
                  <Image style={styles.supportImage} source={require('../../assets/images/supportImg.png')} />
                </View>
              </TouchableOpacity>
              <View style={styles.space}></View>
              <TouchableOpacity onPress={socialLink}>
                <View style={styles.supportContainer}> 
                  <Text style={styles.supportAndSocialText} allowFontScaling={false}>Social</Text>
                  <Image style={styles.socialImage} source={require('../../assets/images/socialImg.png')} />
                </View>
              </TouchableOpacity>
            </View>

            {/* MODALE SUPPORTO */}
            <Modal
              animationType="fade"
              transparent={true}
              visible={popupVisible}
              onRequestClose={closeModal}
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
                      }, 300);
                    }}>
                      <Text style={styles.buttonText} allowFontScaling={false}>Whatsapp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.siteButton} onPress={() => {
                      mail();
                      setTimeout(() => {
                        closeModal();
                      }, 300);
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

            {/* MODALE LOGIN */}
            <LoginModal
              loginPopupVisible={loginPopupVisible}
              setLoginPopupVisible={setLoginPopupVisible}
              setIsLogged={setIsLogged}
              loginUser={loginUser}
              loadInfo={loadInfo}
              setRegisterPopupVisible={setRegisterPopupVisible}
            />


            {/* MODALE REGISTRAZIONE */}
            <RegisterModal
              registerPopupVisible={registerPopupVisible}
              setRegisterPopupVisible={setRegisterPopupVisible}
              loadInfo={loadInfo}
              modalContentStyle={modalContentStyle}
              modalTitleStyle={modalTitleStyle}
              isDark = {isDark}
              setTermsModalVisible={setTermsModalVisible}
              registerUser={registerUser}
              setIsLogged={setIsLogged}
              setLoginPopupVisible={setLoginPopupVisible}
            />

            {/* MODALE NOME UTENTE */}
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

            {/* MODALE TERMINI E CONDIZIONI */}
            <Modal
              animationType="fade"
              transparent={true}
              visible={termsModalVisible}
              onRequestClose={() => setTermsModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={modalContentStyle}>
                  <Text style={modalTitleStyle} allowFontScaling={false}>Termini e Condizioni</Text>
                    <TermsAndConditions />
                    <TouchableOpacity style={styles.closeButton} onPress={() => { setTermsModalVisible(false); setRegisterPopupVisible(true); }}>
                      <Text style={styles.closeButtonText} allowFontScaling={false}>Chiudi</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

            

          </View>
        </ScrollView>
        {/* BOTTOM SHEET MODAL (menu dal basso)

           <BottomSheetModal
                       ref={bottomSheetModalRef}
                       onChange={handleSheetChanges}
                       stackBehavior='replace'
                     >
                       <BottomSheetView style={styles.contentContainer}>
                         <Text>Awesome 🎉</Text>
                       </BottomSheetView>
                   </BottomSheetModal> */}

      </Screen>
    </ScreenContainer>
    </SafeAreaView>
    // {/* </BottomSheetModalProvider>
    // </GestureHandlerRootView> */}
  );
}
const styles = StyleSheet.create({

  scroll: {
    flexGrow: 1,
    paddingBottom: Platform.select({
      android: 90,
    }),
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
  
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#000',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    overflow: 'hidden',
  },

  registerButton: {
    backgroundColor: '#79C7DA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    minWidth: 100,
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#01722B',
    backgroundColor: '#fff',
  },

  checkboxLabel: {
    marginLeft: 8,
    color: '#000',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },

  bottomModal: {
  justifyContent: 'flex-end',
  margin: 0,
},
bottomContent: {
  backgroundColor: '#fff',
  padding: 20,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  minHeight: 180,
},
handle: {
  width: 40,
  height: 4,
  backgroundColor: '#ccc',
  borderRadius: 2,
  alignSelf: 'center',
  marginBottom: 10,
},

bottomSheetContent: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
},
bottomButton: {
  backgroundColor: '#01722B',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 30,
  alignSelf: 'center',
  marginTop: 20,
},

contentContainer: {
    flex: 1,
    alignItems: 'center',
    minHeight: 180,
    zIndex: 1000,
  },

});
