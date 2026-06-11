import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BottomNavigationBarProps {
  activeTab?: "home" | "profile";
  onPressHome?: () => void;
  onPressProfile?: () => void;
  onPressDetection?: () => void;
}

export default function BottomNavigationBar({
  activeTab = "home",
  onPressHome,
  onPressProfile,
  onPressDetection,
}: BottomNavigationBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { height: 70 + insets.bottom }]}>
      {/* Bar latar belakang */}
      <View style={[styles.barContainer, { paddingBottom: insets.bottom }]}>
        {/* --- Segmen Kiri: Home --- */}
        <TouchableOpacity
          style={styles.tab}
          onPress={onPressHome}
          activeOpacity={0.7}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "home" }}
        >
          <Image
            source={{
              uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/0c83j90y_expires_30_days.png",
            }}
            resizeMode="contain"
            style={styles.tabIcon}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "home"
                ? styles.activeTabText
                : styles.inactiveTabText,
            ]}
          >
            Beranda
          </Text>
        </TouchableOpacity>

        {/* --- Segmen Tengah: tempat tombol scan mengambang --- */}
        <View style={styles.centerPlaceholder}>
          {/* Tombol scan akan melayang di atas area ini via absolute positioning */}
        </View>

        {/* --- Segmen Kanan: Profile --- */}
        <TouchableOpacity
          style={styles.tab}
          onPress={onPressProfile}
          activeOpacity={0.7}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "profile" }}
        >
          <Image
            source={{
              uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/51d8x384_expires_30_days.png",
            }}
            resizeMode="contain"
            style={styles.tabIcon}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "profile"
                ? styles.activeTabText
                : styles.inactiveTabText,
            ]}
          >
            Saya
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tombol Scan mengambang */}
      <View style={[styles.floatingContainer, { bottom: insets.bottom }]} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.scanButton}
          onPress={onPressDetection}
          activeOpacity={0.8}
          accessibilityLabel="Deteksi"
        >
          <Image
            source={{
              uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/169vei7q_expires_30_days.png",
            }}
            resizeMode="contain"
            style={styles.scanIcon}
          />
        </TouchableOpacity>
        <Text style={styles.detectionText}>Deteksi</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "transparent",
  },
  barContainer: {
    flex: 1,               // memenuhi sisa tinggi container
    flexDirection: "row",
    backgroundColor: "#EEEEEC",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: "center",
    justifyContent: "space-between",   // membagi ruang di antara ketiga elemen
    paddingHorizontal: 16,            // sedikit ruang dari tepi layar
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
    elevation: 5,
  },
  tab: {
    flex: 1,               // tiap tab mengambil ruang yang sama besar
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  centerPlaceholder: {
    flex: 1,               // lebar sama dengan tab, tempat tombol float di atasnya
    height: "100%",
  },
  tabIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 10,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#572B18",
  },
  inactiveTabText: {
    color: "#484745",
  },
  floatingContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    alignItems: "center",
    justifyContent: "center",    // tombol tepat di tengah (vertikal & horizontal)
    pointerEvents: "box-none",
  },
  scanButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#C99B82",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 8,
    // margin negatif agar setengah tombol masuk ke dalam bar
    marginBottom: 20,
  },
  scanIcon: {
    width: 24,
    height: 24,
    tintColor: "#FFFFFF",
  },
  detectionText: {
    color: "#1C1C1B",
    fontSize: 10,
    fontWeight: "600",
    marginTop: -12,      // mendekatkan teks ke tombol karena tombol sudah digeser
  },
});