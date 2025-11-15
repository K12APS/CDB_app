import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import TermsAndConditions from "@/components/Terms";

const TermsBottomSheet = forwardRef(({ onClose, openRegister }, ref) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const isDark = useColorScheme() === "dark";

  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.present(),
    close: () => sheetRef.current?.dismiss(),
  }));

  const handleClose = () => {
    sheetRef.current?.dismiss();
    setTimeout(() => openRegister?.(), 150);
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={["80%"]}
      enablePanDownToClose
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
        onClose?.();
        setTimeout(() => openRegister?.(), 150);
      }}
    >
      <BottomSheetView style={[styles.container, { backgroundColor: isDark ? "#1F1F1F" : "#F7F7F7" }]}>

        <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>
          Termini e Condizioni
        </Text>

        <View style={styles.termsBox}>
          <TermsAndConditions />
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeText}>Chiudi</Text>
        </TouchableOpacity>

      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    flex: 1,
  },

  title: {
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    marginBottom: 10,
    textAlign: "center",
  },

  termsBox: {
    flex: 1,
    marginBottom: 20,
  },

  closeButton: {
    backgroundColor: "#FFBE00",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },

  closeText: {
    fontSize: 15,
    color: "#fff",
    fontFamily: "Poppins-Bold",
  },
});

export default TermsBottomSheet;
