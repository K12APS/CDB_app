import React, { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, useColorScheme } from "react-native";
import { Checkbox } from "expo-checkbox";
import { BottomSheetModal, BottomSheetView  } from "@gorhom/bottom-sheet";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const RegisterBottomSheet = forwardRef(
  (
    {
      loadInfo,
      modalTitleStyle,
      termsBottomSheetRef,
      registerUser,
      setIsLogged,
      setLoginPopupVisible,
      setEmailVerified,
    },
    ref
  ) => {
    const sheetRef = useRef<BottomSheetModal>(null);

    const isDark = useColorScheme() === "dark";
    const bg = isDark ? "#1F1F1F" : "#F7F7F7";
    const fg = isDark ? "#FFFFFF" : "#000000";
    const subtle = isDark ? "#3A3A3A" : "#EDEDED";

    // Inputs
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [TermsAccepted, setTermsAccepted] = useState(false);

    // Auth state
    const [authStatus, setAuthStatus] = useState<string | null>(null);
    const [authColor, setAuthColor] = useState("red");
    const [showPassword, setShowPassword] = useState(false);

    // expose open/close
    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.present(),
      close: () => sheetRef.current?.dismiss(),
    }));

    const resetForm = () => {
      setAuthStatus(null);
      setUsername("");
      setEmail("");
      setPassword("");
      setPasswordConfirm("");
      setTermsAccepted(false);
    };

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={["78%"]}
        enablePanDownToClose
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        onDismiss={resetForm}
        backgroundStyle={{
          backgroundColor: bg,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
        handleIndicatorStyle={{
          backgroundColor: isDark ? "#777" : "#AAA",
          width: 45,
        }}
      >
          <BottomSheetView
            style={[styles.container, { backgroundColor: bg }]}
          >
            {/* TITLE */}
            <Text
              style={[styles.title, { color: fg }]}
              allowFontScaling={false}
            >
              Registrazione
            </Text>

            {authStatus && (
              <Text
                style={[styles.authMessage, { color: authColor }]}
                allowFontScaling={false}
              >
                {authStatus}
              </Text>
            )}

            {/* INPUT */}
            <View style={[styles.inputContainer, { backgroundColor: subtle }]}>
              <TextInput
                placeholder="Username"
                placeholderTextColor={isDark ? "#AAA" : "#777"}
                value={username}
                onChangeText={setUsername}
                style={[styles.input, { color: fg }]}
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: subtle }]}>
              <TextInput
                placeholder="Email"
                placeholderTextColor={isDark ? "#AAA" : "#777"}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.input, { color: fg }]}
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: subtle }]}>
              <TextInput
                placeholder="Password"
                secureTextEntry={!showPassword}
                placeholderTextColor={isDark ? "#AAA" : "#777"}
                value={password}
                onChangeText={setPassword}
                style={[styles.input, { color: fg }]}
              />

              <TouchableOpacity
                style={{ position: "absolute", right: 12, top: 12 }}
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#777"
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.inputContainer, { backgroundColor: subtle }]}>
              <TextInput
                placeholder="Conferma Password"
                secureTextEntry={!showPassword}
                placeholderTextColor={isDark ? "#AAA" : "#777"}
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                style={[styles.input, { color: fg }]}
              />

              <TouchableOpacity
                style={{ position: "absolute", right: 12, top: 12 }}
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#777"
                />
              </TouchableOpacity>
            </View>

            {/* CHECKBOX TERMIINI */}
            <View style={styles.checkboxRow}>
              <Checkbox
                value={TermsAccepted}
                onValueChange={setTermsAccepted}
                color={TermsAccepted ? "#01722B" : undefined}
                style={styles.checkbox}
              />

              <Text
                style={[styles.checkboxLabel, { color: fg }]}
                onPress={() => {
                  sheetRef.current?.dismiss();
                  setTimeout(() => termsBottomSheetRef.current?.open(), 200);
                }}
              >
                Accetto i termini e le condizioni
              </Text>
            </View>

            {/* BUTTONS */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  registerUser(
                    username,
                    email,
                    password,
                    passwordConfirm,
                    TermsAccepted,
                    setIsLogged,
                    setAuthStatus,
                    setAuthColor,
                    setEmail,
                    setUsername,
                    setPassword,
                    setPasswordConfirm,
                    setTermsAccepted,
                    setEmailVerified,
                    () => sheetRef.current?.dismiss(),
                    loadInfo
                  );
                }}
              >
                <Text style={styles.primaryText}>Registrati</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => sheetRef.current?.dismiss()}
              >
                <Text style={styles.secondaryText}>Chiudi</Text>
              </TouchableOpacity>
            </View>

            {/* SWITCH TO LOGIN */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => {
                sheetRef.current?.dismiss();
                setTimeout(() => setLoginPopupVisible(true), 200);
              }}
            >
              <Text style={styles.registerText}>Accedi</Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheetModal>
      
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },

  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginBottom: 15,
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

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#01722B",
  },

  checkboxLabel: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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

  registerButton: {
    marginTop: 20,
    alignSelf: "center",
  },

  registerText: {
    color: "#79C7DA",
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
  },
});

export default RegisterBottomSheet;
