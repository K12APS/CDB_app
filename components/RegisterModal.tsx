import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet, useColorScheme, StyleProp, ViewStyle, TextStyle,  } from 'react-native';
import { Checkbox } from 'expo-checkbox';



interface RegisterModalProps {
    registerPopupVisible: boolean;
    setRegisterPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
    //authStatus: string | null;
    //setAuthStatus: (status: string | null) => void;
    //setNome: React.Dispatch<React.SetStateAction<string>>;
    //setCognome: React.Dispatch<React.SetStateAction<string>>;
    // setEmail: React.Dispatch<React.SetStateAction<string>>;
    // setPassword: React.Dispatch<React.SetStateAction<string>>;
    // setPasswordConfirm: React.Dispatch<React.SetStateAction<string>>;
    // setTermsAccepted: React.Dispatch<React.SetStateAction<boolean>>;
    loadInfo: () => void;
    modalContentStyle?: StyleProp<ViewStyle>;
    modalTitleStyle?: StyleProp<TextStyle>;
    // authColor?: string;
    // nome: string;
    // cognome: string;
    // email: string;
    // password: string;
    // passwordConfirm: string;
    // TermsAccepted: boolean;
    isDark?: boolean;
    setTermsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    registerUser: (
        nome: string,
        cognome: string,
        email: string,
        password: string,
        passwordConfirm: string,
        TermsAccepted: boolean,
        setIsLogged: React.Dispatch<React.SetStateAction<boolean>>,
        setAuthStatus: (status: string | null) => void,
        setAuthColor: (color: string) => void,
        setEmail: React.Dispatch<React.SetStateAction<string>>,
        setNome: React.Dispatch<React.SetStateAction<string>>,
        setCognome: React.Dispatch<React.SetStateAction<string>>,
        setPassword: React.Dispatch<React.SetStateAction<string>>,
        setPasswordConfirm: React.Dispatch<React.SetStateAction<string>>,
        setTermsAccepted: React.Dispatch<React.SetStateAction<boolean>>,
        setRegisterPopupVisible: React.Dispatch<React.SetStateAction<boolean>>,
        loadInfo: () => void
    ) => void;
    setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
    setAuthColor: (color: string) => void;
    setLoginPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
    registerPopupVisible,
    setRegisterPopupVisible,
    // authStatus,
    // setAuthStatus,
    // setNome,
    // setCognome,
    // setEmail,
    // setPassword,
    // setPasswordConfirm,
    // setTermsAccepted,
    loadInfo,
    modalContentStyle,
    modalTitleStyle,
    // authColor,
    // nome,
    // cognome,
    // email,
    // password,
    // passwordConfirm,
    // TermsAccepted,
    isDark,
    setTermsModalVisible,
    registerUser,
    setIsLogged,
    //setAuthColor,
    setLoginPopupVisible
}) => {

    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [TermsAccepted, setTermsAccepted] = useState(false);

    const [authStatus, setAuthStatus] = useState<string | null>(null);
    const [authColor, setAuthColor] = useState('red');
    return (

      
    <Modal
                  animationType="fade"
                  transparent={true}
                  visible={registerPopupVisible}
                  onRequestClose={() => setRegisterPopupVisible(false)}
                >
                  <View style={styles.modalContainer}>
                    <View style={modalContentStyle}>
                      <Text style={modalTitleStyle} allowFontScaling={false}>Registrazione</Text>
                      <Text style={{ color: authColor, marginBottom: 10, fontSize: 14 }} allowFontScaling={false}>{authStatus}</Text>
                      <TextInput placeholder="Nome"  style={styles.input} onChangeText={setNome} autoCapitalize='words' value={nome}/>
                      <TextInput placeholder="Cognome"  style={styles.input} onChangeText={setCognome} autoCapitalize='words' value={cognome}/>
                      <TextInput placeholder="Email"  style={styles.input} onChangeText={setEmail} keyboardType='email-address' inputMode='email' autoCapitalize='none' autoCorrect={false} textContentType='emailAddress' autoComplete='email' value={email}/>
                      <TextInput placeholder="Password" secureTextEntry={true} style={styles.input} onChangeText={setPassword} textContentType="newPassword" passwordRules="minlength: 10; required: upper; required: lower; required: digit; maxlength: 25; required: special" autoComplete='new-password' value={password}/>
                      <TextInput placeholder="Conferma Password" secureTextEntry={true} style={styles.input} onChangeText={setPasswordConfirm} textContentType="newPassword" passwordRules="minlength: 10; required: upper; required: lower; required: digit; maxlength: 25; required: special" autoComplete='new-password' value={passwordConfirm}/>
    
                      <View style={styles.checkboxContainer}>
                        <Checkbox
                          value={TermsAccepted}
                          onValueChange={setTermsAccepted}
                          color={TermsAccepted ? '#01722B' : undefined}
                          style={styles.checkbox}
                        />
                        {/* handlePresentModalPress */}
                        <Text style={[styles.checkboxLabel, { color: isDark ? '#fff' : '#000' }]} onPress={() => { setRegisterPopupVisible(false); setTermsModalVisible(true); }}>
                          Accetto i termini e le condizioni
                        </Text>
                      </View>
    
                      <View style ={styles.supportButton}>
                        <TouchableOpacity style={styles.saveButton} onPress={() => {registerUser(nome, cognome, email, password, passwordConfirm, TermsAccepted, setIsLogged, setAuthStatus, setAuthColor, setEmail, setNome, setCognome, setPassword, setPasswordConfirm, setTermsAccepted, setRegisterPopupVisible, loadInfo);}}>
                            <Text style={styles.buttonText} allowFontScaling={false}>Registrati</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.closeButton} onPress={() =>{setRegisterPopupVisible(false); setAuthStatus(null); setNome(''); setCognome(''); setEmail(''); setPassword(''); setPasswordConfirm(''); setTermsAccepted(false);}}>
                            <Text style={styles.closeButtonText} allowFontScaling={false}>Chiudi</Text>
    
                          </TouchableOpacity>
                      </View>
    
                      <TouchableOpacity style={styles.registerButton} onPress={() => {
                        setRegisterPopupVisible(false);
                        setAuthStatus(null);
                        setLoginPopupVisible(true);
                      }}>
                        <Text style={styles.buttonText} allowFontScaling={false}>Accedi</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)', // Sfondo scuro trasparente
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
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: -2,
    textAlign: 'center',
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
  registerButton: {
    backgroundColor: '#79C7DA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    minWidth: 100,
  },
});


export default RegisterModal;