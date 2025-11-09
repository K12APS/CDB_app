import { Text, View, StyleSheet, TouchableOpacity, Modal, ScrollView, useColorScheme, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ScreenContainer, Screen } from 'react-native-screens'; 
import { enableScreens } from 'react-native-screens'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import axios from 'axios';
import HeaderBar from "@/components/HeaderBar";

import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { isLoaded } from 'expo-font';

import LoginModal from '../../components/loginModal';
import RegisterModal from '../../components/RegisterModal';

import { loginUser, registerUser } from '@/utils/authUtils';

import TermsAndConditions from '@/components/Terms';



enableScreens();

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const containerStyle = isDark ? styles.containerDark : styles.containerLight;
  const modalContentStyle = isDark ? styles.modalContentDark : styles.modalContentLight;
  const modalTitleStyle = isDark ? styles.modalTitleDark : styles.modalTitleLight;
  const modalTextStyle = isDark ? styles.modalTextDark : styles.modalTextLight;

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { setUserName } = useContext(UserContext);
  const { setIsLogged, isLogged } = useContext(UserContext);

  const [loginPopupVisible, setLoginPopupVisible] = useState(false);
  const [registerPopupVisible, setRegisterPopupVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  

  const login = () => {
    setLoginPopupVisible(true);
  }

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

  

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userName');
    setUserName('Accedi/registrati');
    setLogoutModalVisible(false);
    setIsLogged(false);
    Alert.alert('Logout', 'Hai effettuato il logout con successo.');
    console.log('Token rimosso, utente disconnesso');
  };

  const deleteAccount = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete('https://api.coderdojobrianza.it:3000/deleteAccount', {
        headers: { Authorization: `${token}` }
      });
      await AsyncStorage.clear();
      setDeleteModalVisible(false);
      Alert.alert('Account eliminato', 'Il tuo account è stato eliminato con successo.');
    } catch (error) {
      Alert.alert('Errore', 'Impossibile eliminare l’account.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#1E1E1E' : '#ffffff' }} edges={['top', 'left', 'right']}>
      <ScreenContainer style={{ flex: 1 }}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Screen style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <HeaderBar title="Impostazioni" />
            <View style={containerStyle}>

                {!isLogged ? (
                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => {login();}}
                    >
                        <Text style={styles.settingText}>Accedi o Registrati</Text>
                    </TouchableOpacity>
                ) : (
                <>
                    <TouchableOpacity style={styles.settingItem} onPress={() => setLogoutModalVisible(true)}>
                    <Text style={styles.settingText}>Esci dall’account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem} onPress={() => setDeleteModalVisible(true)}>
                    <Text style={[styles.settingText, { color: 'red' }]}>Elimina account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Prossimamente', 'Funzione in sviluppo')}>
                    <Text style={styles.settingText}>Cambia password</Text>
                    </TouchableOpacity>
                </>
                )}


             

              <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Prossimamente', 'Funzione in sviluppo')}>
                <Text style={styles.settingText}>Notifiche</Text>
              </TouchableOpacity>

              {/* MODALE LOGOUT */}
              <Modal animationType="fade" transparent={true} visible={logoutModalVisible} onRequestClose={() => setLogoutModalVisible(false)}>
                <View style={styles.modalContainer}>
                  <View style={modalContentStyle}>
                    <Text style={modalTitleStyle}>Conferma Logout</Text>
                    <Text style={modalTextStyle}>Vuoi davvero uscire dal tuo account?</Text>
                    <View style={styles.modalButtons}>
                      <TouchableOpacity style={styles.confirmButton} onPress={logout}>
                        <Text style={styles.buttonText}>Sì, esci</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.cancelButton} onPress={() => setLogoutModalVisible(false)}>
                        <Text style={styles.buttonText}>Annulla</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

              {/* MODALE ELIMINA ACCOUNT */}
              <Modal animationType="fade" transparent={true} visible={deleteModalVisible} onRequestClose={() => setDeleteModalVisible(false)}>
                <View style={styles.modalContainer}>
                  <View style={modalContentStyle}>
                    <Text style={modalTitleStyle}>Elimina account</Text>
                    <Text style={modalTextStyle}>Questa azione è irreversibile. Vuoi continuare?</Text>
                    <View style={styles.modalButtons}>
                      <TouchableOpacity style={[styles.confirmButton, { backgroundColor: 'red' }]} onPress={deleteAccount}>
                        <Text style={styles.buttonText}>Elimina</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.cancelButton} onPress={() => setDeleteModalVisible(false)}>
                        <Text style={styles.buttonText}>Annulla</Text>
                      </TouchableOpacity>
                    </View>
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
        </Screen>
      </ScreenContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingBottom: 90,
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
  settingItem: {
    backgroundColor: '#f6f6f6',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  settingText: {
    color: '#000',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    textAlign: 'center',
  },
  modalTextLight: {
    fontSize: 16,
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    backgroundColor: '#01722B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#FFBE00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
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
});
