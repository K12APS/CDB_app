import { Text, View, Modal, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import NoEvent from '@/components/NoEvent';
import PopUp from '@/components/PopUp'; 
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShadowBox, NeomorphBox } from 'react-native-neomorph-shadows';
import { StatusBar } from 'expo-status-bar';


const addImage = require('@/assets/images/add.png');

const notification = require('@/assets/images/notification.png');
const activeNotification = require('@/assets/images/activeNotification.png');



export default function EventiScreen() {

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const containerStyle = isDark ? styles.containerDark : styles.containerLight;

  const [modalVisible, setModalVisible] = useState(false); // Stato per gestire la visibilità del modal
  const [cards, setCards] = useState<Array<any>>([]); // Stato per memorizzare le card
  const [popupVisible, setPopupVisible] = useState(false);
  const [isActive, setIsActive] = useState(false); // Stato per gestire l'attivazione della campanella
  const mesiAbbreviati = [
    'GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU', 'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'
  ];

  const [tutorialVisible, setTutorialVisible] = useState(false); // Stato per il tutorial
  const [tutorialStep, setTutorialStep] = useState(0); // Passo corrente del tutorial

  const tutorialSteps = [
    "Questa è la tua schermata eventi.",
    "Premi il pulsante '+' per aggiungere un nuovo evento.",
    "Tieni premuto una card per eliminarla.",
    
  ];

  // Controlla se il tutorial deve essere mostrato
  useEffect(() => {
    const checkTutorial = async () => {
      const tutorialCompleted = await AsyncStorage.getItem('tutorialCompleted');
      console.log(tutorialCompleted);
      
      if (tutorialCompleted !== 'true') {
        setTutorialVisible(true); // Mostra il tutorial solo se non è stato completato
      }
    };
    
    checkTutorial();
  }, []);
  

  // Salva lo stato del completamento del tutorial
  const completeTutorial = async () => {
    setTutorialVisible(false);
    await AsyncStorage.setItem('tutorialCompleted', 'true');
  };

  // Gestisce il passaggio al prossimo passo del tutorial
  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      completeTutorial(); // Completa il tutorial
    }
  };


  // Funzione per aprire il popup
  const openModal = () => {
    setModalVisible(true);
  };

  // Funzione per chiudere il popup
  const closeModal = () => {
    setModalVisible(false);
  };

  // Funzione per aggiungere una nuova card
  const addCard = async (data) => {
    const newCards = [...cards, data];
    setCards(newCards);
    try {
      await AsyncStorage.setItem('eventCards', JSON.stringify(newCards)); // Salva le card in AsyncStorage
    } catch (error) {
      console.error('Errore durante il salvataggio delle card', error);
    }
  };

  // Carica le card da AsyncStorage quando il componente viene montato
  useEffect(() => {
    const loadCards = async () => {
      try {
        const storedCards = await AsyncStorage.getItem('eventCards');
        if (storedCards) {
          setCards(JSON.parse(storedCards)); // Imposta le card salvate in stato
        }
      } catch (error) {
        console.error('Errore durante il recupero delle card', error);
      }
    };

    loadCards();
  }, []);

  // Funzione per rimuovere una card
  

  const removeCard = async (index: number): Promise<void> => {
    const newCards = cards.filter((_, cardIndex: number) => cardIndex !== index);
    setCards(newCards);
    try {
      await AsyncStorage.setItem('eventCards', JSON.stringify(newCards));
    } catch (error) {
      console.error('Errore durante il salvataggio delle card', error);
    }
  };

  // Funzione per gestire il long press (apertura pop-up o eliminazione della card) 
  const handleLongPress = (index) => {
    Alert.alert(
      "Sei sicuro di voler eliminare questo biglietto?",
      "Seleziona un'opzione",
      [
        {
          text: "Annulla",
          style: "cancel"
        },
        {
          text: "Conferma", 
          onPress: () => removeCard(index)
        },
      ]
    );
  };

  // Funzione per cambiare lo stato della campanella
  const toggleNotification = () => {
    //setIsActive(!isActive); // Cambia lo stato della campanella (attivo/non attivo)
    setPopupVisible(true);  // Mostra il popup
    setTimeout(() => {
      setPopupVisible(false);  // Nasconde il popup dopo 3 secondi
    }, 2000);  
  };

  return (
    <ScrollView 
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 100, // Aumentato da 80 a 100
      }} 
      style={{ 
        flex: 1,
        backgroundColor: isDark ? '#1E1E1E' : '#ffffff' 
      }}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={containerStyle}>


         {/* Tutorial Modal */}
         <Modal
          visible={tutorialVisible}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.tutorialModalBackground}>
            <View style={styles.tutorialContainer}>
              <Text style={styles.tutorialText}>{tutorialSteps[tutorialStep]}</Text>
              <TouchableOpacity style={styles.tutorialButton} onPress={nextTutorialStep}>
                <Text style={styles.tutorialButtonText}>
                  {tutorialStep < tutorialSteps.length - 1 ? "Avanti" : "Fine"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


        {/* Se non ci sono eventi, mostra il componente NoEvent */}
        {cards.length === 0 ? <NoEvent /> : null}

        {/* Renderizza le card */}
        {cards.map((card, index) => (
          <TouchableOpacity
            key={index}
            onLongPress={() => handleLongPress(index)} // Gestisce il long press
            style={card.selectedOption === 'ScratchDay' ? styles.cardScratch : styles.cardMulti}
          >
            <Text allowFontScaling={false} style={styles.cardTitle}>{card.selectedOption}</Text>
            
            {/* Campanella per notifiche */}
            <TouchableOpacity onPress={toggleNotification} style={styles.notificationContainer}>
              <Image 
                style={styles.notification}
                source={isActive ? activeNotification : notification} // Usa l'immagine in base allo stato
              />
            </TouchableOpacity>
            
            <View style={styles.cardContent}>
              <View style={styles.DateCard}>
                <ShadowBox
                  inner
                  useSvg
                  style={{
                    shadowOffset: {width: 1, height: 5}, 
                    shadowOpacity: card.selectedOption === 'ScratchDay' ? .5 : .7,
                    shadowColor: "#000",
                    shadowRadius: 3,
                    borderRadius: 35,
                    backgroundColor:  card.selectedOption === 'ScratchDay' ? '#f3CB04' : '#01732B',
                    width: 92,
                    height: 108,
                  }}
                >

                  <Text allowFontScaling={false} style={styles.numberDate}>{card.giorno}</Text>
                  <Text allowFontScaling={false} style={styles.monthDate}>{mesiAbbreviati[parseInt(card.mese) - 1]}</Text>
                </ShadowBox>
              </View>
              
              <View style={styles.eventTextContainer}>
                <Text allowFontScaling={false} style= {styles.description}>{card.venue}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Bottone per aprire il pop-up */}
        <TouchableOpacity style={styles.addButtonContainer} onPress={openModal}>
          <Image source={addImage}></Image>
        </TouchableOpacity>

        {/* Renderizza PopUp e passagli addCard come prop //TODO gestire dark theme*/}
        <PopUp modalVisible={modalVisible} closeModal={closeModal} addCard={addCard} />

        {/* Modal per notifiche non disponibili */}
        <Modal
          visible={popupVisible}
          animationType="fade"
          onRequestClose={() => setPopupVisible(false)} // Chiude il popup quando l'utente preme indietro
          transparent={true}>
          <View style={styles.modalBackground}>
            <View style={styles.popupContainer}>
              <Text style={styles.popupText} allowFontScaling={false}>Le notifiche non sono ancora disponibili</Text>
              <TouchableOpacity onPress={() => setPopupVisible(false)}>
                <Text style={styles.closeText} allowFontScaling={false}>Chiudi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerDark: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 16,
    position: 'relative', // Assicura il corretto posizionamento del bottone
  },
  containerLight: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    position: 'relative', // Assicura il corretto posizionamento del bottone
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 40, // Aumentato da 20 a 30
    right: 16,
    height: 56,
    width: 56,
    backgroundColor: '#f3CB04',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardScratch: {
    backgroundColor: '#f3CB04',
    borderRadius: 30,
    padding: 16,
    marginBottom: 20,
    height: 200,
    paddingLeft: 30,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  cardMulti: {
    backgroundColor: '#01732B',
    borderRadius: 30,
    padding: 16,
    marginBottom: 20,
    height: 200,
    paddingLeft: 30,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  cardTitle: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 5,
    fontFamily: 'Poppins-Bold'
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  DateCard: {
    padding: 0,
    height: 108,
    borderRadius: 30,
    width: 92,
    justifyContent: "center",
    alignContent: "center",
  },
  numberDate: {
    marginTop: 0,
    textAlign: 'center',
    fontSize: 40,
    color: "#ffffff",
    fontFamily: 'Poppins-Bold',
    marginBottom: -15,
  },
  monthDate: {
    textAlign: 'center',
    fontSize: 27,
    color: "#ffffff",
    fontFamily: 'Poppins-Bold',
  },
  eventTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  description: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingLeft: 10,
    color: "#ffffff",
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
  },
  notificationContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  notification: {
    width: 50,
    height: 50,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Sfondo semitrasparente
  },
  popupContainer: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 50, // Distanza dal basso
    alignItems: 'center',
  },
  popupText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
  },
  closeText: {
    fontSize: 14,
    color: '#f3CB04',
    fontFamily: 'Poppins-Bold',
  },


  tutorialModalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tutorialContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  tutorialText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center', 
    fontFamily: 'Poppins-SemiBold',
  },
  tutorialButton: {
    backgroundColor: '#f3CB04',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  tutorialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    textTransform: 'uppercase',
  },
  
});
