import { Text, View, StyleSheet, TouchableOpacity, Modal, ScrollView, useColorScheme, Alert, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ScreenContainer, Screen } from 'react-native-screens'; 
import { enableScreens } from 'react-native-screens'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import HeaderBar from "@/components/HeaderBar";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Portal } from '@gorhom/portal';
import {
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

import { loginUser, registerUser } from '@/utils/authUtils';

import LoginButtonSheet from '../../components/LoginButtonSheet';
import RegisterBottomSheet from '../../components/RegisterBottomSheet';
import TermsBottomSheet from '../../components/TermsBottomSheet';
import PasswordChangeBottomSheet from '../../components/PasswordChangeBottomSheet';



enableScreens();

export default function SettingsScreen() {
  const loginBottomSheetRef = useRef<any>(null);
  const registerBottomSheetRef = useRef<any>(null);
  const termsBottomSheetRef = useRef<any>(null);
  const passwordBottomSheetRef = useRef<any>(null);
  const pswChangeBottomSheetRef = useRef<any>(null);

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

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [authColor, setAuthColor] = useState<string>('green');
  
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  const verifyPassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,25}$/; //minimo 10 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale massimo 25 caratteri
    return regex.test(password);
  }

  const changePassword = async () => {
  
    const token = await AsyncStorage.getItem('token');
    if(!token) {
      setAuthStatus('Devi essere loggato per cambiare la password.');
      setAuthColor('red');
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setAuthStatus('Le nuove password non corrispondono.');
      setAuthColor('red');
      return;
    }

    if (!verifyPassword(newPassword)) {
      //Alert.alert('Errore', 'La nuova password non soddisfa i requisiti.');
      setAuthStatus('La nuova password non soddisfa i requisiti.');
      setAuthColor('red');
      return;
    }

    try {
      const response = await axios.post('https://api.coderdojobrianza.it:3000/requestPasswordChange', 
        {oldPassword, newPassword}, 
        {headers: { Authorization: `${token}` }
      });

      if(response.status === 200) {

        setOldPassword('');
        setNewPassword('');
        setNewPasswordConfirm('');
        setAuthStatus('Password cambiata con successo.');
        setAuthColor('green');
        await AsyncStorage.setItem('token', response.headers['x-renewed-token']);
        setTimeout(() => {
          passwordBottomSheetRef.current?.dismiss();
        }, 900);
      } else {
        setAuthStatus('Impossibile cambiare la password.');
        setAuthColor('red');
      }
    } catch (error) {
      setAuthStatus('Si è verificato un errore durante il cambio della password.');
      setAuthColor('red');
      console.log(error)
    }
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

        if (response.headers['x-renewed-token']) {
          await AsyncStorage.setItem('token', response.headers['x-renewed-token']);
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

    const res = await axios.delete(
      'https://api.coderdojobrianza.it:3000/deleteAccount',
      {
        headers: { Authorization: token }
      }
    );

    if (res.status === 200) {
      //await AsyncStorage.clear();
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userName');
      setUserName('Accedi/registrati');
      setIsLogged(false);
      setDeleteModalVisible(false);
      Alert.alert('Account eliminato', 'Il tuo account è stato eliminato con successo.');
    }

  } catch (error) {
    const axiosError = error as any;

    if (axiosError.response) {

      if (axiosError.response.status === 500) {
        Alert.alert('Errore', 'Errore del server. Riprova più tardi.');
        return;
      }

      if (axiosError.response.status === 401) {
        Alert.alert('Sessione scaduta', 'Effettua nuovamente il login.');
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userName');
        setUserName('Accedi/registrati');
        setIsLogged(false);
          return;
        }

      // altri errori del server
      Alert.alert('Errore', axiosError.response.data?.message || 'Errore sconosciuto.');
      return;

    } else {
      //errori di rete / timeout
      Alert.alert('Errore', 'Connessione al server non riuscita.');
    }
  }
};

  return (
    <>
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isDark ? "#1E1E1E" : "#ffffff" }}
      edges={["top", "left", "right"]}
    >
      <ScreenContainer style={{ flex: 1 }}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Screen style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            <HeaderBar title="Impostazioni" />
            <View style={containerStyle}>
              {!isLogged ? (
                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={() => {
                    loginBottomSheetRef.current?.open()
                  }}
                >
                  <Text style={styles.settingText}>Accedi o Registrati</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.settingItem}
                    onPress={() => setLogoutModalVisible(true)}
                  >
                    <Text style={styles.settingText}>Esci dall’account</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.settingItem}
                    onPress={() => setDeleteModalVisible(true)}
                  >
                    <Text style={[styles.settingText, { color: "red" }]}>
                      Elimina account
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.settingItem}
                    onPress={() =>
                      //Alert.alert("Prossimamente", "Funzione in sviluppo")
                      passwordBottomSheetRef.current?.present()
                    }
                  >
                    <Text style={styles.settingText}>Cambia password</Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                style={styles.settingItem}
                onPress={() =>
                  Alert.alert("Prossimamente", "Funzione in sviluppo")
                }
              >
                <Text style={styles.settingText}>Notifiche</Text>
              </TouchableOpacity>

              {/* MODALE LOGOUT */}
              <Modal
                animationType="fade"
                transparent={true}
                visible={logoutModalVisible}
                onRequestClose={() => setLogoutModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={modalContentStyle}>
                    <Text style={modalTitleStyle}>Conferma Logout</Text>
                    <Text style={modalTextStyle}>
                      Vuoi davvero uscire dal tuo account?
                    </Text>
                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={logout}
                      >
                        <Text style={styles.buttonText}>Sì, esci</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setLogoutModalVisible(false)}
                      >
                        <Text style={styles.buttonText}>Annulla</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>


              {/* MODALE ELIMINA ACCOUNT */}
              <Modal
                animationType="fade"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => setDeleteModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={modalContentStyle}>
                    <Text style={modalTitleStyle}>Elimina account</Text>
                    <Text style={modalTextStyle}>
                      Questa azione è irreversibile. Vuoi continuare?
                    </Text>
                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={[
                          styles.confirmButton,
                          { backgroundColor: "red" },
                        ]}
                        onPress={deleteAccount}
                      >
                        <Text style={styles.buttonText}>Elimina</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setDeleteModalVisible(false)}
                      >
                        <Text style={styles.buttonText}>Annulla</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          </ScrollView>
        </Screen>
      </ScreenContainer>
    </SafeAreaView>

    <Portal hostName="bottom-sheet-portal">
         {/* LOGIN bottom sheet (NUOVO) */}
        <LoginButtonSheet
          ref={loginBottomSheetRef}
          setIsLogged={setIsLogged}
          loginUser={loginUser}
          loadInfo={loadInfo}
          registerBottomSheetRef={registerBottomSheetRef}
          pswChangeBottomSheetRef={pswChangeBottomSheetRef}
        />

        <RegisterBottomSheet
        ref={registerBottomSheetRef}
        setIsLogged={setIsLogged}
        registerUser={registerUser}
        loadInfo={loadInfo}
        setLoginPopupVisible={() => loginBottomSheetRef.current?.open()}
        termsBottomSheetRef={termsBottomSheetRef}
        isDark={isDark}
      />

      <TermsBottomSheet
        ref={termsBottomSheetRef}
        onClose={() => {}}
        openRegister={() => registerBottomSheetRef.current?.open()}
      />

      <PasswordChangeBottomSheet
        ref={pswChangeBottomSheetRef}
        onClose={() => {}}
        openLogin={() => loginBottomSheetRef.current?.open()}
      />

      {/* BOTTOM SHEET CAMBIO PASSWORD */}
      <BottomSheetModal
        ref={passwordBottomSheetRef}
        snapPoints={["65%"]}
        enablePanDownToClose={true}
        backgroundStyle={{
          backgroundColor: isDark ? "#1F1F1F" : "#F7F7F7",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
        handleIndicatorStyle={{
          backgroundColor: isDark ? "#777" : "#AAA",
          width: 45,
        }}
        onDismiss={() => {
          setAuthStatus("");
          setAuthColor("green");
          setOldPassword("");
          setNewPassword("");
          setNewPasswordConfirm("");
        }}
      >
        <BottomSheetView
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 40,
            backgroundColor: isDark ? "#1F1F1F" : "#F7F7F7",
          }}
        >
          {/* TITRE */}
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Poppins-Bold",
              textAlign: "center",
              marginBottom: 15,
              color: isDark ? "#fff" : "#000",
            }}
          >
            Cambia Password
          </Text>

          {/* STATUS */}
          {authStatus ? (
            <Text
              style={{
                color: authColor,
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              {authStatus}
            </Text>
          ) : null}

          {/* OLD PASSWORD */}
          <View
            style={{
              width: "100%",
              backgroundColor: isDark ? "#3A3A3A" : "#EDEDED",
              borderRadius: 14,
              marginBottom: 15,
              paddingHorizontal: 14,
              paddingVertical: 4,
              position: "relative",
            }}
          >
            <TextInput
              placeholder="Vecchia Password"
              placeholderTextColor={isDark ? "#AAA" : "#777"}
              secureTextEntry={!showOld}
              value={oldPassword}
              onChangeText={setOldPassword}
              style={{
                height: 45,
                fontSize: 16,
                color: isDark ? "#fff" : "#000",
                paddingRight: 40,
                fontFamily: "Poppins-Regular",
              }}
            />
            <TouchableOpacity
              style={{ position: "absolute", right: 12, top: 12 }}
              onPress={() => setShowOld(!showOld)}
            >
              <MaterialCommunityIcons
                name={showOld ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#777"
              />
            </TouchableOpacity>
          </View>

          {/* NEW PASSWORD */}
          <View
            style={{
              width: "100%",
              backgroundColor: isDark ? "#3A3A3A" : "#EDEDED",
              borderRadius: 14,
              marginBottom: 15,
              paddingHorizontal: 14,
              paddingVertical: 4,
              position: "relative",
            }}
          >
            <TextInput
              placeholder="Nuova Password"
              placeholderTextColor={isDark ? "#AAA" : "#777"}
              secureTextEntry={!showNew}
              value={newPassword}
              onChangeText={setNewPassword}
              style={{
                height: 45,
                fontSize: 16,
                color: isDark ? "#fff" : "#000",
                paddingRight: 40,
                fontFamily: "Poppins-Regular",
              }}
            />
            <TouchableOpacity
              style={{ position: "absolute", right: 12, top: 12 }}
              onPress={() => setShowNew(!showNew)}
            >
              <MaterialCommunityIcons
                name={showNew ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#777"
              />
            </TouchableOpacity>
          </View>

          {/* CONFIRM PASSWORD */}
          <View
            style={{
              width: "100%",
              backgroundColor: isDark ? "#3A3A3A" : "#EDEDED",
              borderRadius: 14,
              marginBottom: 20,
              paddingHorizontal: 14,
              paddingVertical: 4,
              position: "relative",
            }}
          >
            <TextInput
              placeholder="Conferma Nuova Password"
              placeholderTextColor={isDark ? "#AAA" : "#777"}
              secureTextEntry={!showConfirm}
              value={newPasswordConfirm}
              onChangeText={setNewPasswordConfirm}
              style={{
                height: 45,
                fontSize: 16,
                color: isDark ? "#fff" : "#000",
                paddingRight: 40,
                fontFamily: "Poppins-Regular",
              }}
            />
            <TouchableOpacity
              style={{ position: "absolute", right: 12, top: 12 }}
              onPress={() => setShowConfirm(!showConfirm)}
            >
              <MaterialCommunityIcons
                name={showConfirm ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#777"
              />
            </TouchableOpacity>
          </View>

          {/* BUTTONS */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#01722B",
                paddingVertical: 12,
                borderRadius: 14,
                alignItems: "center",
              }}
              onPress={changePassword}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 15,
                  fontFamily: "Poppins-SemiBold",
                }}
              >
                Conferma
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#FFBE00",
                paddingVertical: 12,
                borderRadius: 14,
                alignItems: "center",
              }}
              onPress={() => passwordBottomSheetRef.current?.dismiss()}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 15,
                  fontFamily: "Poppins-Bold",
                }}
              >
                Chiudi
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>



      </Portal>
    </>
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
  supportButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  passwordContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F0F0F0',
  borderRadius: 10,
  paddingHorizontal: 15,
  marginBottom: 20,
},
inputWrapper: {
  width: '100%',
  marginBottom: 20,
},
inputWithIcon: {
  width: '100%',
  height: 50,
  backgroundColor: '#F0F0F0',
  borderRadius: 10,
  paddingHorizontal: 15,
  paddingRight: 45, // spazio per l'icona
  color: '#000',
  fontSize: 16,
  fontFamily: 'Poppins-Regular',
},
eyeButton: {
  position: 'absolute',
  right: 15,
  top: 13,
},


});
