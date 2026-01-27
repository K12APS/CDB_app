import React, { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, useColorScheme } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import axios from "axios";

const PasswordChangeBottomSheet = forwardRef(({
  onClose, openLogin,
}, ref) => {

  const sheetRef = useRef<BottomSheetModal>(null);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const fg = isDark ? "#FFFFFF" : "#000000";
  const subtle = isDark ? "#3A3A3A" : "#F0F0F0";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [statusColor, setStatusColor] = useState("#01722B");

  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.present(),
    close: () => sheetRef.current?.dismiss(),
  }));

  const handleClose = () => {
    sheetRef.current?.dismiss();
    setTimeout(() => openLogin?.(), 150);
  };

  const verifyEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return regex.test(email);
  };

  const resetPassworEmail = async (email: string) => {

    if (!email) {
        setStatus("Per favore, inserisci un'email valida.");
        setStatusColor("red");
        return;
    }

    if(!verifyEmail(email)) {
      setStatus('Inserisci un indirizzo email valido.');
      setStatusColor?.('red');
      return;
    }

    try {

        const response = await axios.post('https://api.coderdojobrianza.it/requestPasswordResetEmail', {
            email: email
        });
        
        if(response.status === 200) {
            setStatus("Ti abbiamo inviato un'email con il link per reimpostare la password.");
            setStatusColor("#01722B");
            setTimeout(() => {
                handleClose();
            }, 2000);
        } else {
            setStatus(response.data.message || "Si è verificato un errore. Riprova più tardi.");
            setStatusColor("red");
        }
    } catch (error) {
        setStatus("Si è verificato un errore. Riprova più tardi.");
        setStatusColor("red");
        console.error("Password reset error:", error);
    }
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={["45%"]}
      enablePanDownToClose
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustPan"
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
        setEmail("");
        setStatus(null);
        onClose?.();
        setTimeout(() => openLogin?.(), 150);
      }}
    >
      <BottomSheetView style={[styles.container]}>

        <Text style={[styles.title, { color: fg }]}>
          Recupero password
        </Text>

        <Text style={[styles.subtitle, { color: fg }]}>
          Inserisci la tua email, ti invieremo un link per reimpostare la password.
        </Text>

        {status && (
          <Text style={[styles.authMessage, { color: statusColor }]}>
            {status}
          </Text>
        )}

        {/* EMAIL */}
        <View style={[styles.inputContainer, { backgroundColor: subtle }]}>
          <TextInput
            placeholder="Email"
            placeholderTextColor={isDark ? "#AAA" : "#777"}
            style={[styles.input, { color: fg }]}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* BOTTONI */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              resetPassworEmail(email)
            }
          >
            <Text style={styles.primaryText}>Invia link</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => sheetRef.current?.dismiss()}
          >
            <Text style={styles.secondaryText}>Chiudi</Text>
          </TouchableOpacity>
        </View>

        {/* TORNA AL LOGIN */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            handleClose();
          }}
        >
          <Text style={styles.backText}>Torna al login</Text>
        </TouchableOpacity>

      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },

  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
    opacity: 0.8,
  },

  authMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },

  inputContainer: {
    width: "100%",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 15,
  },

  input: {
    height: 45,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },

  primaryButton: {
    flex: 1,
    backgroundColor: "#01722B",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },

  primaryText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: "#FFBE00",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },

  secondaryText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Poppins-Bold",
  },

  backButton: {
    marginTop: 20,
    alignSelf: "center",
  },

  backText: {
    color: "#79C7DA",
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
  },
});

export default PasswordChangeBottomSheet;
