import React, { useState } from "react";
import { View, ScrollView, Image, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    alert(`Logging in with:\nEmail: ${email}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Image
              source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/u8qdjcl8_expires_30_days.png" }}
              resizeMode="stretch"
              style={styles.logo}
            />
            <Text style={styles.title}>
              {"ArecaNut Grade"}
            </Text>
          </View>
          
          <View style={styles.inputsWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#6B6B6B"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#6B6B6B"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>
                {"Login"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/fxjc99ey_expires_30_days.png" }}
                resizeMode="stretch"
                style={styles.dividerIcon}
              />
              <View style={styles.dividerLine} />
            </View>
            
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLinkText}>
                {"Don't have an account? Register"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  formContainer: {
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 110,
    height: 79,
    marginBottom: 16,
  },
  title: {
    color: "#000000",
    fontSize: 24,
    fontWeight: "bold",
  },
  inputsWrapper: {
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E5E5",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#1F1B16",
    shadowColor: "#0000000D",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 2,
    elevation: 2,
  },
  loginButton: {
    alignItems: "center",
    backgroundColor: "#572B18",
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 8,
    shadowColor: "#0000001A",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 4,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    paddingTop: 16,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  dividerLine: {
    height: 1,
    flex: 1,
    backgroundColor: "#D1D5DB",
  },
  dividerIcon: {
    width: 40,
    height: 40,
    marginHorizontal: 16,
  },
  registerLinkText: {
    color: "#1F2937",
    fontSize: 14,
    fontWeight: "600",
  },
});