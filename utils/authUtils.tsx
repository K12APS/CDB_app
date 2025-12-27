import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";



const verifyEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return regex.test(email);
  };

  //funzione verifica password
  const verifyPassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,25}$/; //minimo 10 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale massimo 25 caratteri
    return regex.test(password);
  }

 export const loginUser = async (
    email: string,
    password: string,
    setIsLogged?: (v: boolean) => void,
    setAuthStatus?: (msg: string | null) => void,
    setAuthColor?: (color: string) => void,
    setLoginPopupVisible?: (v: boolean) => void,
    setEmail?: (email: string) => void,
    setPassword?: (password: string) => void,
    loadInfoCallback?: () => Promise<boolean | undefined>,
    setEmailVerified?: (v: boolean) => void

) => {

    setEmail?.(email.trim().toLowerCase());
    
    if(!email || !password) {
      setAuthStatus?.('Compila tutti i campi');
      setAuthColor?.('red');
      return;
    }

    if(!verifyEmail(email)) {
      setAuthStatus?.('Inserisci un indirizzo email valido.');
      setAuthColor?.('red');
      return;
    }


    try {
      axios.post('https://api.coderdojobrianza.it:3000/login', {
        email: email,
        password: password
      })
      .then(async (response) => {

        await AsyncStorage.setItem('token', response.data.token);
        setEmailVerified?.(true);
        setIsLogged?.(true);

        setAuthStatus?.('Login effettuato con successo!');
        setAuthColor?.('green');


        // nascondi il messaggio dopo 2 secondi e chiudi il popup
        setTimeout(() => {
          setLoginPopupVisible?.(false);
          setAuthStatus?.(null);
          setEmail?.('');
          setPassword?.('');
        }, 2000);

        loadInfoCallback?.();
      })
      .catch(error => {
        if(error.response && error.response.status === 401) {
        setAuthStatus?.('Email o password errati.');
        setAuthColor?.('red');
        } else {
          setAuthStatus?.('Si è verificato un errore durante il login.');
          setAuthColor?.('red');
        }

      });
    } catch (error) {
      
    }
  }



    export const registerUser = async (
    nome: string,
    cognome: string,
    email: string,
    password: string,
    passwordConfirm: string,
    TermsAccepted: boolean,
    setIsLogged: (v: boolean) => void,
    setAuthStatus: (msg: string | null) => void,
    setAuthColor: (color: string) => void,
    setEmail: (email: string) => void,
    setNome: (nome: string) => void,
    setCognome: (cognome: string) => void,
    setPassword: (password: string) => void,
    setPasswordConfirm: (password: string) => void,
    setTermsAccepted: (v: boolean) => void,
    setEmailVerified: (v: boolean) => void,
    setRegisterPopupVisible: (v: boolean) => void,
    loadInfo: () => Promise<boolean | undefined>
    ): Promise<void> => {  
    console.log('nome:', nome);
    console.log('cognome:', cognome);
    console.log('email:', email);
    console.log('password:', password);

    setEmail(email.trim().toLowerCase());
    setNome(nome.trim());
    setCognome(cognome.trim());

    //verifica lunghezza campi
    if(nome.length < 2 || cognome.length < 2) {
      setAuthStatus('Nome e cognome devono contenere almeno 2 caratteri.');
      setAuthColor('red');
      return;
    }

    //verifica inserimento campi
    if(!nome || !cognome || !email || !password) {
      setAuthStatus('Compila tutti i campi');
      setAuthColor('red');
      return;
    }

    //verifica email valida
    if(!verifyEmail(email)) {
      setAuthStatus('Inserisci un indirizzo email valido.');
      setAuthColor('red');
      return;
    }

    //verifica password
    if(!verifyPassword(password)) {
      console.log('password non valida');
      setAuthStatus('La password deve contenere almeno 10 caratteri, una lettera maiuscola, una minuscola, un numero e un carattere speciale.');
      setAuthColor('red');
      return;
    }

    //verifica conferma password
    if(password !== passwordConfirm) {
      setAuthStatus('Le password non corrispondono.');
      setAuthColor('red');
      return;
    }

    //verifica accettazione termini
    if(!TermsAccepted) {
      setAuthStatus('Devi accettare i termini e condizioni.');
      setAuthColor('red');
      return;
    }

    axios.post('https://api.coderdojobrianza.it:3000/register', {
      nome: nome,
      cognome: cognome,
      email: email,
      password: password,
    })

    .then(() => {
      setEmailVerified(false);
      setPassword('');
      setEmail('');
      setCognome('');
      setNome('');
      setPasswordConfirm('');
      setTermsAccepted(false);

      setAuthStatus('Registrazione completata. Controlla la mail per verificare l’account.');
      setAuthColor('green');

      setTimeout(() => {
        setRegisterPopupVisible(false);
        setAuthStatus(null);
      }, 2000);
    })
    .catch(error => {
      if (error.response && error.response.status === 409) {
        setAuthStatus('Questa email è già registrata');
      } else {
        setAuthStatus('Si è verificato un errore durante la registrazione');
      }
    });
  }

  // export const loadInfo = async (setUserName: (name: string) => void) => {
  //       try {
  //         const token = await AsyncStorage.getItem('token');
  //         if(!token) {
  //           await AsyncStorage.setItem('userName', 'Accedi/registrati');
  //           return false;
  //         }
  
  //         const response = await axios.get('https://api.coderdojobrianza.it:3000/loadInfo', {
  //           headers: { Authorization: `${token}` }
  //         });
  
  //         if (response.status !== 200) {
  //           await AsyncStorage.setItem('userName', 'Accedi/registrati');
  //           return false;
  //         }
  
  //         if (response.headers['x-new-token']) {
  //           await AsyncStorage.setItem('token', response.headers['x-new-token']);
  //         }
  //         setUserName(response.data.user.nome);
  //         await AsyncStorage.setItem('userName', response.data.user.nome);
  //         return true;
  //       } catch (error) {
  //         console.error(error);
  //         await AsyncStorage.setItem('userName', 'Accedi/registrati');
  //       }
  //     };