import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const verifyEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return regex.test(email);
};

// funzione verifica password
const verifyPassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,25}$/;
    return regex.test(password);
};

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

    if (!email || !password) {
        setAuthStatus?.('Compila tutti i campi');
        setAuthColor?.('red');
        return;
    }

    if (!verifyEmail(email)) {
        setAuthStatus?.('Inserisci un indirizzo email valido.');
        setAuthColor?.('red');
        return;
    }

    try {
        axios.post('https://api.coderdojobrianza.it/login', {
            email: email,
            password: password
        })
        .then(async (response) => {
            await AsyncStorage.setItem('token', response.data.token);
            setEmailVerified?.(true);
            setIsLogged?.(true);

            setAuthStatus?.('Login effettuato con successo!');
            setAuthColor?.('green');

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
    } catch (error) {}
};

export const registerUser = async (
    username: string,
    email: string,
    password: string,
    passwordConfirm: string,
    TermsAccepted: boolean,
    setIsLogged: (v: boolean) => void,
    setAuthStatus: (msg: string | null) => void,
    setAuthColor: (color: string) => void,
    setEmail: (email: string) => void,
    setUsername: (username: string) => void,
    setPassword: (password: string) => void,
    setPasswordConfirm: (password: string) => void,
    setTermsAccepted: (v: boolean) => void,
    setEmailVerified: (v: boolean) => void,
    setRegisterPopupVisible: (v: boolean) => void,
    loadInfo: () => Promise<boolean | undefined>
): Promise<void> => {
    setEmail(email.trim().toLowerCase());
    setUsername(username.trim());

    // verifica lunghezza username
    if(username.length < 2) {
        setAuthStatus('Username deve contenere almeno 2 caratteri.');
        setAuthColor('red');
        return;
    }

    // verifica inserimento campi
    if(!username || !email || !password) {
        setAuthStatus('Compila tutti i campi');
        setAuthColor('red');
        return;
    }

    // verifica email valida
    if(!verifyEmail(email)) {
        setAuthStatus('Inserisci un indirizzo email valido.');
        setAuthColor('red');
        return;
    }

    // verifica password
    if(!verifyPassword(password)) {
        setAuthStatus('La password deve contenere almeno 10 caratteri, una lettera maiuscola, una minuscola, un numero e un carattere speciale.');
        setAuthColor('red');
        return;
    }

    // verifica conferma password
    if(password !== passwordConfirm) {
        setAuthStatus('Le password non corrispondono.');
        setAuthColor('red');
        return;
    }

    // verifica accettazione termini
    if(!TermsAccepted) {
        setAuthStatus('Devi accettare i termini e condizioni.');
        setAuthColor('red');
        return;
    }

    axios.post('https://api.coderdojobrianza.it/register', {
        username: username,
        email: email,
        password: password,
    })
    .then(() => {
        setEmailVerified(false);
        setPassword('');
        setEmail('');
        setUsername('');
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
};
