import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, useColorScheme } from 'react-native';

import { api } from '../services/api';



const PopUp = ({ modalVisible, closeModal, addCard }) => {

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const modalContaierStyle = isDark ? styles.modalContainerDark : styles.modalContainerLight;
  const titleStyle = isDark ? styles.titleDark : styles.titleLight;
  const inputStyle = isDark ? styles.inputDark : styles.inputLight;
  const dateInputStyle = isDark ? styles.dateInputDark : styles.dateInputLight;


  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [giorno, setGiorno] = useState('');
  const [mese, setMese] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [venue, setVenue] = useState('');
  const [nomeError, setNomeError] = useState('');
  const [cognomeError, setCognomeError] = useState('');
  const [giornoError, setGiornoError] = useState('');
  const [meseError, setMeseError] = useState('');
  const [optionError, setOptionError] = useState('');
  const [apiError, setApiError] = useState('');

  const saveData = async () => {
    let valid = true;

    if (nome.trim() === '') {
      setNomeError('Il nome è obbligatorio');
      valid = false;
    } else {
      setNomeError('');
    }

    if (cognome.trim() === '') {
      setCognomeError('Il cognome è obbligatorio');
      valid = false;
    } else {
      setCognomeError('');
    }

    if (giorno.trim() === '') {
      setGiornoError('Il giorno è obbligatorio');
      valid = false;
    } else {
      setGiornoError('');
    }

    const giornoNum = parseInt(giorno);

    if (isNaN(giornoNum)) {
      setMeseError('Il giorno è obbligatorio');
      valid = false;
    } else if (giornoNum >= 1 && giornoNum <= 31) {
      setGiornoError(''); 
      setGiorno(giorno);
    } else {
      setGiornoError('Il giorno deve essere compreso tra 1 e 31');
      setMese(giorno);
      valid = false;
    }

    if (mese.trim() === '') {
      setMeseError('Il mese è obbligatorio');
      valid = false;
    } else {
      setMeseError('');
    }

    const meseNum = parseInt(mese);
    if (isNaN(meseNum)) {
      setMeseError('Il mese è obbligatorio');
      valid = false;
      setMese(mese);
    } else if (meseNum >= 1 && meseNum <= 12) {
      setMeseError('');
      setMese(mese);
    } else {
      setMeseError('Il mese deve essere compreso tra 1 e 12');
      setMese(mese);
      valid = false;
    }

    

    // if (!selectedOption) {
    //   setOptionError('Seleziona un\'opzione');
    //   valid = false;
      
    // } else {
    //   setOptionError('');
    // }
    if(!valid) {
      return;
    }
    const { events: allEvents, error } = await api({size: 30}); // Chiamata alla funzione api

    if (error) {
      setApiError(error);
      return;
    } else {
      setApiError('');
    }
  
    // Verifica se l'evento con il giorno e mese esiste
    const eventExists = allEvents.find((event) => {
      // Estrai la data dal campo 'start.local' in formato "YYYY-MM-DD"
      const eventDateStr = event.start.local.split('T')[0]; // "2025-02-15"
      const eventDate = new Date(eventDateStr); // Crea oggetto Date da stringa
  
      const eventGiorno = eventDate.getDate();
      const eventMese = eventDate.getMonth() + 1; // I mesi sono indicizzati da 0 (gennaio è 0, quindi aggiungiamo 1)
      
  
      // Controlla se il giorno e mese corrispondono
      return eventGiorno === giornoNum && eventMese === meseNum;  //todo aggiungere il controllo per l'opzione (tipologia evento) oppure inserire la tipologia automaticamente tramite la chiamata api
    });
  
    if (!eventExists) {
      setApiError('Evento non trovato per la data selezionata.');
      valid = false;
    }
    const eventType = eventExists.name.text.split('|')[0].trim();
    const localizedAddress = eventExists.venue.address.localized_multi_line_address_display;
    const formattedVenue = localizedAddress.join(', ');
    const nameLocation = eventExists.venue.name || '';
    const location = nameLocation + ', ' + formattedVenue;
  
    //const localizedAddress = venueAddress?.localized_address_display;
    

    if (!valid) {
      return; // Non procedere se ci sono errori
    }

    const data = { nome, cognome, giorno, mese, selectedOption: eventType, venue: location };
    try {
      // Aggiungi la card alla lista principale
      addCard(data);

      // Chiudi il modal e resetta i campi
      closeModal();
      resetFields();
    } catch (error) {
      console.error('Error saving data', error);
    }
  };

  const resetFields = () => {
    setNome('');
    setCognome('');
    setGiorno('');
    setMese('');
    setSelectedOption('');
    resetErrors();
  };

  const resetErrors = () => {
    setNomeError('');
    setCognomeError('');
    setGiornoError('');
    setMeseError('');
    setOptionError('');
    setApiError('');
  };

  

  return (
    <Modal
      visible={modalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <View style={modalContaierStyle}>
          <Text style={titleStyle} allowFontScaling={false}>Aggiungi un biglietto</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[inputStyle, nomeError && styles.inputError]} 
              placeholder="Nome*"
              value={nome}
              onChangeText={setNome}
              allowFontScaling={false}
            />
            {nomeError ? <Text allowFontScaling={false} style={styles.errorText}>{nomeError}</Text> : null}

            <TextInput
              style={[inputStyle, cognomeError && styles.inputError]} 
              placeholder="Cognome*"
              value={cognome}
              onChangeText={setCognome}
              allowFontScaling={false}
            />
            {cognomeError ? <Text allowFontScaling={false} style={styles.errorText}>{cognomeError}</Text> : null}

            <View style={styles.dateContainer}>
              <View style={styles.inputWithError}>
                <TextInput
                  style={[dateInputStyle, giornoError && styles.inputError]} 
                  placeholder="Giorno*"
                  keyboardType="numeric"
                  value={giorno}
                  onChangeText={setGiorno}
                  allowFontScaling={false}
                />
                {giornoError ? <Text allowFontScaling={false} style={styles.errorText}>{giornoError}</Text> : null}
              </View>

              <View style={styles.inputWithError}>
                <TextInput
                  style={[dateInputStyle, meseError && styles.inputError]} 
                  placeholder="Mese*"
                  keyboardType="numeric"
                  value={mese}
                  onChangeText= {setMese} 
                  allowFontScaling={false}
                />
                {meseError ? <Text allowFontScaling={false} style={styles.errorText}>{meseError}</Text> : null}
              </View>
            </View>

            {/* <View style={styles.selectionContainer}>
              <TouchableOpacity
                style={[styles.option, selectedOption === 'ScratchDay' && styles.focusedOption]}
                onPress={() => setSelectedOption('ScratchDay')}
              >
                <Text allowFontScaling={false} style={styles.button}>ScratchDay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.option, selectedOption === 'Multilab' && styles.focusedOption]}
                onPress={() => setSelectedOption('Multilab')}
              >
                <Text allowFontScaling={false} style={styles.button}>Multilab</Text>
              </TouchableOpacity>
            </View>
            {optionError ? <Text allowFontScaling={false} style={styles.errorText}>{optionError}</Text> : null} */}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity style={styles.confirmButton} onPress={saveData}>
              <Text allowFontScaling={false} style={styles.closeButtonText}>Conferma</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={() => {
                closeModal();
                resetFields(); 
              }}>
              <Text allowFontScaling={false} style={styles.closeButtonText}>Cancella</Text>
            </TouchableOpacity>
          </View>
          {apiError ? <Text allowFontScaling={false} style={styles.errorText}>{apiError}</Text> : null}
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainerDark: {
    width: 300,
    padding: 20,
    backgroundColor: '#3A3A3A',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalContainerLight: {
    width: 300,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    alignItems: 'center',
  },
  
  titleDark: {
    fontSize: 20,
    marginBottom: 15,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },
  titleLight: {
    fontSize: 20,
    marginBottom: 15,
    fontFamily: 'Poppins-Bold',
    color: '#000',
  },

  inputDark: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 7,
    marginBottom: 7,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
  },
  inputLight: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 7,
    marginBottom: 7,
    fontFamily: 'Poppins-Regular',
    color: '#000',
  },

  inputError: {
    borderColor: 'red', // Colore per il bordo in caso di errore
    marginBottom: 0, // Aggiungi un margine sopra l'input in caso di errore
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 10, // Aggiungi lo stesso margine tra ogni errore e campo
    fontFamily: 'Poppins-Regular',
  },
  button: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  closeButton: {
    backgroundColor: '#FFBE00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    marginLeft: 20,
  },
  confirmButton: {
    backgroundColor: '#01722B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: -2
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputWithError: {
    width: '48%',
    marginBottom: 10,  // Distanza tra l'input e l'errore
  },
  dateInputDark: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    color: '#fff',
  },
  dateInputLight: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    color: '#000',
  },

  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  option: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  focusedOption: {
    backgroundColor: '#FFBE00', // Colore quando l'opzione è selezionata
  },
});

//!TODO aggiunger font

export default PopUp;
