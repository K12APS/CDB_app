import React, { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, useColorScheme } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

const LoginBottomSheet = forwardRef(({
  setIsLogged,
  loginUser,
  loadInfo,
  registerBottomSheetRef,
  pswChangeBottomSheetRef,
  setEmailVerified,
}, ref) => {

  const sheetRef = useRef<BottomSheetModal>(null);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const bg = isDark ? "#1F1F1F" : "#FFFFFF";
  const fg = isDark ? "#FFFFFF" : "#000000";
  const subtle = isDark ? "#3A3A3A" : "#F0F0F0";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [authColor, setAuthColor] = useState("red");

  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.present(),
    close: () => sheetRef.current?.dismiss(),
  }));

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={["55%"]}
      enablePanDownToClose={true}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustPan"
       backgroundStyle={{
        backgroundColor: isDark ? "#1F1F1F" : "#F7F7F7", // ✔️ più elegante
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: "#000",
        shadowOpacity: 0.08,      // ✔️ ombra soft
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -3 },
        elevation: 5,             // ✔️ ombra su Android
      }}
      handleIndicatorStyle={{
        backgroundColor: isDark ? "#777" : "#AAA", // più visibile
        width: 45,
      }}
      onDismiss={() => {
        setAuthStatus(null);
        setEmail("");
        setPassword("");
      }}
    >
      <BottomSheetView style={[styles.container, { backgroundColor: isDark ? "#1F1F1F" : "#F7F7F7" }]}>

        <Text style={[styles.title, { color: fg }]}>Accedi</Text>

        {authStatus && (
          <Text style={[styles.authMessage, { color: authColor }]} allowFontScaling={false}>
            {authStatus}
          </Text>
        )}

        {/* INPUT EMAIL */}
        <View style={[styles.inputContainer, { backgroundColor: subtle }]}>
          <TextInput
            placeholder="Email"
            placeholderTextColor={isDark ? "#AAA" : "#777"}
            style={[styles.input, { color: fg }]}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* INPUT PASSWORD */}
        <View style={[styles.inputContainer, { backgroundColor: subtle }]}>
          <TextInput
            placeholder="Password"
            placeholderTextColor={isDark ? "#AAA" : "#777"}
            secureTextEntry
            style={[styles.input, { color: fg }]}
            onChangeText={setPassword}
          />
        </View>


        <TouchableOpacity
          style={styles.passwordButton}
          onPress={() => {
            sheetRef.current?.dismiss();
            setTimeout(() => pswChangeBottomSheetRef.current?.open(), 200);
          }}
        >
          <Text style={styles.passwordText}>Password dimenticata</Text>
        </TouchableOpacity>


        {/* BOTTONI */}
        <View style={styles.buttonRow}>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              loginUser(
                email,
                password,
                setIsLogged,
                setAuthStatus,
                setAuthColor,
                () => sheetRef.current?.dismiss(),
                setEmail,
                setPassword,
                loadInfo,
                setEmailVerified,
              );
            }}
          >
            <Text style={styles.primaryText}>Accedi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => sheetRef.current?.dismiss()}
          >
            <Text style={styles.secondaryText}>Chiudi</Text>
          </TouchableOpacity>
        </View>

        {/* LINK REGISTRAZIONE */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => {
            sheetRef.current?.dismiss();
            setTimeout(() =>  registerBottomSheetRef.current?.open(), 200);
          }}
        >
          <Text style={styles.registerText}>Registrati</Text>
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

  passwordButton: {
    textAlign: "left",
    marginBottom: 5,
  },

  passwordText: {
    color: "#79C7DA",
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
  },
});

export default LoginBottomSheet;
