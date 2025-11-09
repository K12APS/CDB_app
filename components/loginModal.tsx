
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet, useColorScheme } from 'react-native';
import React, { useState } from 'react';

const LoginModal = ({
    loginPopupVisible,
    setLoginPopupVisible,
    setIsLogged,
    loginUser,
    loadInfo,
    setRegisterPopupVisible,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const modalContentStyle = isDark ? styles.modalContentDark : styles.modalContentLight;
  const modalTitleStyle = isDark ? styles.modalTitleDark : styles.modalTitleLight;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [authColor, setAuthColor] = useState('red');

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={loginPopupVisible}
      onRequestClose={() => setLoginPopupVisible(false)}
    >
     <View style={styles.modalContainer}>
                <View style={modalContentStyle}>
                  <Text style={modalTitleStyle} allowFontScaling={false}>Login</Text>
                  <Text style={{ color: authColor, marginBottom: 10, fontSize: 14 }} allowFontScaling={false}>{authStatus}</Text>
                  <TextInput placeholder="Email"  style={styles.input} onChangeText={setEmail} keyboardType='email-address' inputMode='email' autoCapitalize='none' autoCorrect={false} textContentType='username' autoComplete='email'/>
                  <TextInput placeholder="Password" secureTextEntry={true} style={styles.input} onChangeText={setPassword} textContentType="password" autoComplete="current-password"/>

                  <View style ={styles.supportButton}>
                    <TouchableOpacity style={styles.saveButton} onPress={() => {loginUser(email, password, setIsLogged, setAuthStatus, setAuthColor, setLoginPopupVisible, setEmail, setPassword, loadInfo);}}>
                        <Text style={styles.buttonText} allowFontScaling={false}>Accedi</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.closeButton} onPress={() => {setLoginPopupVisible(false); setAuthStatus(null); setEmail(''); setPassword('');}}>
                        <Text style={styles.closeButtonText} allowFontScaling={false}>Chiudi</Text>
                      </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.registerButton} onPress={() => {
                    setLoginPopupVisible(false);
                    setAuthStatus(null);
                    setRegisterPopupVisible(true);
                  }}>
                    <Text style={styles.buttonText} allowFontScaling={false}>Registrati</Text>
                  </TouchableOpacity>
                </View>
              </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  },
  supportButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#01722B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    minWidth: 100,
    marginRight: 20,
  },
  closeButton: {
    backgroundColor: '#FFBE00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
    registerButton: {
    backgroundColor: '#79C7DA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    minWidth: 100,
  },
});

export default LoginModal;
