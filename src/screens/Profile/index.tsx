import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import BottomNavigationBar from "../../components/BottomNavigationBar";
import { useAuthStore } from "@/stores/useAuthStore";
import Login from "../Login";
import { API_URL as ENV_API_URL } from "@env";
const API_URL = ENV_API_URL || "https://areca-nut-grade-apps.onrender.com";
import {
  updateUser,
  updatedPhotoProfile,
  deletePhotoProfile,
  deleteUser,
} from "@/services/userService";

export default function Profile({ navigation }: any) {
  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);

  // States untuk edit data profil
  const [modalType, setModalType] = useState<"username" | "email" | "password" | "about" | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [loading, setLoading] = useState(false);

  const getFullImageUrl = (path?: string) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    if (cleanPath.startsWith("/static/")) {
      return `${API_URL}${cleanPath}`;
    }
    return `${API_URL}/static${cleanPath}`;
  };

  useEffect(() => {
    if (token) {
      fetchProfile().catch((err) => {
        console.error("Gagal memuat profil:", err);
      });
    }
  }, [token]);

  if (token === null) {
    return <Login navigation={navigation} />;
  }

  const imageUrl =
    getFullImageUrl(user?.photoProfile) ||
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800";

  // Fungsi mengubah foto profil
  const handleEditPhoto = () => {
    Alert.alert(
      "Ubah Foto Profil",
      "Pilih tindakan untuk foto profil Anda:",
      [
        { text: "Pilih dari Galeri", onPress: () => handlePickPhoto(false) },
        { text: "Ambil dari Kamera", onPress: () => handlePickPhoto(true) },
        user?.photoProfile
          ? { text: "Hapus Foto Profil", style: "destructive", onPress: handleDeletePhoto }
          : null,
        { text: "Batal", style: "cancel" },
      ].filter(Boolean) as any
    );
  };

  const handlePickPhoto = async (useCamera: boolean) => {
    try {
      const permissionResult = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Izin Ditolak",
          `Aplikasi membutuhkan izin ${useCamera ? "kamera" : "galeri"} untuk mengubah foto profil.`
        );
        return;
      }

      const pickerResult = useCamera
        ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 })
        : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });

      if (pickerResult.canceled || !pickerResult.assets || pickerResult.assets.length === 0) {
        return;
      }

      const imageUri = pickerResult.assets[0].uri;
      setLoading(true);
      if (user?.id) {
        await updatedPhotoProfile(user.id, imageUri);
        await fetchProfile();
        Alert.alert("Sukses", "Foto profil berhasil diperbarui.");
      }
    } catch (error) {
      console.error("Gagal mengganti foto profil:", error);
      Alert.alert("Error", "Gagal memperbarui foto profil.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async () => {
    try {
      setLoading(true);
      if (user?.id) {
        await deletePhotoProfile(user.id);
        await fetchProfile();
        Alert.alert("Sukses", "Foto profil berhasil dihapus.");
      }
    } catch (error) {
      console.error("Gagal menghapus foto profil:", error);
      Alert.alert("Error", "Gagal menghapus foto profil.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi membuka modal update data
  const handleOpenEditModal = (type: "username" | "email" | "password") => {
    setModalType(type);
    if (type === "username") {
      setInputValue(user?.username || "");
    } else if (type === "email") {
      setInputValue(user?.email || "");
    } else {
      setInputValue("");
      setPasswordValue("");
      setConfirmPasswordValue("");
    }
  };

  // Fungsi menyimpan perubahan input field (Username / Email / Password)
  const handleSaveField = async () => {
    if (!user?.id) return;

    if (modalType === "username" && !inputValue.trim()) {
      Alert.alert("Error", "Username tidak boleh kosong.");
      return;
    }
    if (modalType === "email" && !inputValue.trim()) {
      Alert.alert("Error", "Email tidak boleh kosong.");
      return;
    }
    if (modalType === "password") {
      if (!passwordValue) {
        Alert.alert("Error", "Password tidak boleh kosong.");
        return;
      }
      if (passwordValue !== confirmPasswordValue) {
        Alert.alert("Error", "Konfirmasi password tidak cocok.");
        return;
      }
    }

    try {
      setLoading(true);
      const data: any = {};
      if (modalType === "username") data.username = inputValue;
      if (modalType === "email") data.email = inputValue;
      if (modalType === "password") data.password = passwordValue;

      await updateUser(user.id, data);
      await fetchProfile();
      setModalType(null);
      Alert.alert("Sukses", "Profil berhasil diperbarui.");
    } catch (error: any) {
      console.error("Gagal memperbarui profil:", error);
      Alert.alert("Error", error.response?.data?.detail || "Gagal memperbarui data profil.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi menghapus akun secara permanen
  const handleDeleteAccount = () => {
    Alert.alert(
      "Konfirmasi Hapus Akun",
      "Apakah Anda yakin ingin menghapus akun ini secara permanen? Seluruh riwayat pemindaian Anda juga akan ikut dihapus. Tindakan ini tidak dapat dibatalkan.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus Permanen",
          style: "destructive",
          onPress: async () => {
            try {
              if (user?.id) {
                setLoading(true);
                await deleteUser(user.id);
                await logout();
                Alert.alert("Sukses", "Akun Anda telah berhasil dihapus.");
              }
            } catch (error) {
              console.error("Gagal menghapus akun:", error);
              Alert.alert("Error", "Gagal menghapus akun.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Konfirmasi Logout",
      "Apakah Anda yakin ingin keluar?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert("Error", "Gagal melakukan logout");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#572B18" />
          <Text style={styles.loadingText}>Memproses...</Text>
        </View>
      )}

      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {/* Profile Header */}
          <View style={styles.profileHeaderContainer}>
            <View style={styles.avatarWrapper}>
              <TouchableOpacity activeOpacity={0.85} onPress={handleEditPhoto} style={styles.avatarBackground}>
                <Image
                  source={{ uri: imageUrl }}
                  resizeMode="cover"
                  style={styles.avatarIcon}
                />
                <View style={styles.cameraIconContainer}>
                  <Image
                    source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/khzadvtn_expires_30_days.png" }}
                    resizeMode="contain"
                    style={styles.cameraOverlayIcon}
                  />
                </View>
              </TouchableOpacity>
              <Text style={styles.usernameText}>{user?.username || "Memuat..."}</Text>
              <Text style={styles.updateProfileLink}>{user?.email || "memuat..."} ({user?.role})</Text>
            </View>
          </View>

          {/* Settings Menu Options */}
          <View style={styles.menuContainer}>
            {/* Update Akun */}
            <TouchableOpacity style={styles.menuItem} onPress={() => handleOpenEditModal("username")}>
              <View style={styles.menuItemLeft}>
                <Image
                  source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/bnbz7rmd_expires_30_days.png" }}
                  resizeMode="stretch"
                  style={styles.menuIconUpdateAkun}
                />
                <Text style={styles.menuItemText}>Update Username</Text>
              </View>
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/yl90yp24_expires_30_days.png" }}
                resizeMode="stretch"
                style={styles.chevronIcon}
              />
            </TouchableOpacity>

            {/* Update Email */}
            <TouchableOpacity style={styles.menuItem} onPress={() => handleOpenEditModal("email")}>
              <View style={styles.menuItemLeft}>
                <Image
                  source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/3x2xvjva_expires_30_days.png" }}
                  resizeMode="stretch"
                  style={styles.menuIconUpdateEmail}
                />
                <Text style={styles.menuItemText}>Update Email</Text>
              </View>
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/ihxgq8pn_expires_30_days.png" }}
                resizeMode="stretch"
                style={styles.chevronIcon}
              />
            </TouchableOpacity>

            {/* Update Password */}
            <TouchableOpacity style={styles.menuItem} onPress={() => handleOpenEditModal("password")}>
              <View style={styles.menuItemLeft}>
                <Image
                  source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/lle7s1nm_expires_30_days.png" }}
                  resizeMode="stretch"
                  style={styles.menuIconUpdatePassword}
                />
                <Text style={styles.menuItemText}>Update Password</Text>
              </View>
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/kwvpogxw_expires_30_days.png" }}
                resizeMode="stretch"
                style={styles.chevronIcon}
              />
            </TouchableOpacity>

            {/* Tentang */}
            <TouchableOpacity style={styles.menuItem} onPress={() => setModalType("about")}>
              <View style={styles.menuItemLeft}>
                <Image
                  source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/bovqe2ib_expires_30_days.png" }}
                  resizeMode="stretch"
                  style={styles.menuIconTentang}
                />
                <Text style={styles.menuItemText}>Tentang</Text>
              </View>
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/s8auil5y_expires_30_days.png" }}
                resizeMode="stretch"
                style={styles.chevronIcon}
              />
            </TouchableOpacity>

            {/* Hapus Akun */}
            <TouchableOpacity style={[styles.menuItem, { backgroundColor: "#FEF2F2" }]} onPress={handleDeleteAccount}>
              <View style={styles.menuItemLeft}>
                <Text style={[styles.menuItemText, { color: "#DC2626", fontWeight: "600", marginLeft: 8 }]}>
                  Hapus Akun Permanen
                </Text>
              </View>
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/s8auil5y_expires_30_days.png" }}
                resizeMode="stretch"
                style={styles.chevronIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Image
              source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/z528xtwt_expires_30_days.png" }}
              resizeMode="stretch"
              style={styles.logoutIcon}
            />
            <Text style={styles.logoutText}>Logout Akun</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Reusable Bottom Navigation Bar pinned to the bottom */}
      <BottomNavigationBar
        activeTab="profile"
        onPressHome={() => navigation.navigate("HomeArecaNut")}
        onPressProfile={() => navigation.navigate("Profile")}
        onPressDetection={() => navigation.navigate("HomeArecaNut", { triggerCamera: true })}
      />

      {/* ===== Modal Edit & Info ===== */}
      <Modal
        visible={modalType !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalType(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === "username" && "Update Username"}
              {modalType === "email" && "Update Email"}
              {modalType === "password" && "Update Password"}
              {modalType === "about" && "Tentang Aplikasi"}
            </Text>

            {modalType === "about" ? (
              <ScrollView style={{ maxHeight: 200, marginBottom: 20 }}>
                <Text style={styles.aboutText}>
                  ArecaNut adalah aplikasi pintar berbasis Kecerdasan Buatan (AI) yang mempermudah klasifikasi kualitas/grade biji pinang secara presisi dan waktu nyata.
                </Text>
                <Text style={[styles.aboutText, { marginTop: 12 }]}>
                  Versi Aplikasi: 1.0.0{"\n"}
                  Developer: Aldio Yaspindo Dev
                </Text>
              </ScrollView>
            ) : (
              <View style={{ width: "100%", marginBottom: 20 }}>
                {modalType === "password" ? (
                  <>
                    <Text style={styles.inputLabel}>Password Baru</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Masukkan password baru"
                      secureTextEntry
                      value={passwordValue}
                      onChangeText={setPasswordValue}
                    />
                    <Text style={[styles.inputLabel, { marginTop: 12 }]}>Konfirmasi Password Baru</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Konfirmasi password baru"
                      secureTextEntry
                      value={confirmPasswordValue}
                      onChangeText={setConfirmPasswordValue}
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.inputLabel}>
                      {modalType === "username" ? "Username Baru" : "Email Baru"}
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder={modalType === "username" ? "Masukkan username baru" : "Masukkan email baru"}
                      keyboardType={modalType === "email" ? "email-address" : "default"}
                      autoCapitalize={modalType === "email" ? "none" : "words"}
                      value={inputValue}
                      onChangeText={setInputValue}
                    />
                  </>
                )}
              </View>
            )}

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalType(null)}
              >
                <Text style={styles.cancelButtonText}>Tutup</Text>
              </TouchableOpacity>

              {modalType !== "about" && (
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSaveField}
                  disabled={loading}
                >
                  <Text style={styles.saveButtonText}>Simpan</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
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
  contentContainer: {
    alignItems: "center",
    paddingTop: 16,
  },
  profileHeaderContainer: {
    alignItems: "center",
    paddingBottom: 32,
  },
  avatarWrapper: {
    alignItems: "center",
  },
  avatarBackground: {
    backgroundColor: "#F2EFEC",
    borderRadius: 9999,
    marginBottom: 12,
    width: 100,
    height: 100,
    position: "relative",
  },
  avatarIcon: {
    borderRadius: 9999,
    width: 100,
    height: 100,
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#572B18",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  cameraOverlayIcon: {
    width: 14,
    height: 14,
    tintColor: "#FFFFFF",
  },
  usernameText: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  updateProfileLink: {
    color: "#572B18",
    fontSize: 14,
  },
  menuContainer: {
    alignSelf: "stretch",
    paddingBottom: 40,
    marginHorizontal: 24,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EEEEEC",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIconUpdateAkun: {
    width: 19,
    height: 17,
    marginRight: 12,
  },
  menuIconUpdateEmail: {
    width: 20,
    height: 16,
    marginRight: 12,
  },
  menuIconUpdatePassword: {
    width: 16,
    height: 21,
    marginRight: 12,
  },
  menuIconTentang: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  trashIcon: {
    fontSize: 18,
  },
  menuItemText: {
    color: "#1C1C1A",
    fontSize: 16,
  },
  chevronIcon: {
    borderRadius: 12,
    width: 7,
    height: 12,
  },
  logoutButton: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderColor: "#FEE2E2",
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 17,
    marginTop: 16,
    marginBottom: 48,
    marginHorizontal: 24,
  },
  logoutIcon: {
    borderRadius: 12,
    width: 18,
    height: 18,
    marginRight: 8,
  },
  logoutText: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "bold",
  },

  // ── Modals Style ──
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C1C1B",
    marginBottom: 16,
  },
  inputLabel: {
    alignSelf: "flex-start",
    fontSize: 14,
    color: "#484745",
    marginBottom: 6,
    fontWeight: "500",
  },
  textInput: {
    width: "100%",
    backgroundColor: "#F7F5F2",
    borderColor: "#E0D8D0",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#1C1C1B",
  },
  aboutText: {
    fontSize: 14,
    color: "#484745",
    lineHeight: 20,
    textAlign: "justify",
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#EEEEEC",
    marginRight: 12,
  },
  cancelButtonText: {
    color: "#484745",
    fontSize: 15,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#572B18",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },

  // Loading Overlay
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#572B18",
    fontSize: 16,
    fontWeight: "bold",
  },
});