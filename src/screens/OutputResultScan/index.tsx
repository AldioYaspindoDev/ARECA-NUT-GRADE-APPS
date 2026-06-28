import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import { API_URL as ENV_API_URL } from "@env";
import { getPrices } from "@/services/pinangService";

const API_URL = ENV_API_URL || "https://areca-nut-grade-apps.onrender.com";

export default function OutputResultScan({ route, navigation }: any) {
  const scanResult = route?.params?.scanResult;
  const localImageUri = route?.params?.localImageUri;

  const [realPrice, setRealPrice] = useState<string | null>(null);

  useEffect(() => {
    const fetchRealPrice = async () => {
      if (!scanResult?.grade) return;
      try {
        const prices = await getPrices();
        const matchingPrice = prices.find(
          (p) =>
            p.grade.toLowerCase().trim() === scanResult.grade.toLowerCase().trim() ||
            p.grade.toLowerCase().trim() === `grade ${scanResult.grade.toLowerCase().trim()}` ||
            scanResult.grade.toLowerCase().trim() === `grade ${p.grade.toLowerCase().trim()}`
        );
        if (matchingPrice && matchingPrice.harga) {
          setRealPrice(matchingPrice.harga);
        }
      } catch (error) {
        console.log("Failed to fetch override price", error);
      }
    };
    fetchRealPrice();
  }, [scanResult?.grade]);

  const finalPrice = realPrice || scanResult?.harga_per_kg;

  const getFullImageUrl = (path?: string) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    if (cleanPath.startsWith("/static/")) {
      return `${API_URL}${cleanPath}`;
    }
    return `${API_URL}/static${cleanPath}`;
  };

  const imageUrl = getFullImageUrl(scanResult?.gambar) || localImageUri || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400";

  const handlePress = () => {
    alert("Pressed!");
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.navigate("HomeArecaNut")} style={{ marginRight: 12 }}>
            <Text style={{ fontSize: 24, color: "#1F1B16" }}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {"Hasil Analisis"}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.contentWrapper}>
          <Image
            source={{ uri: imageUrl }}
            resizeMode="cover"
            style={styles.scanImage}
          />

          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <View style={styles.titleSection}>
                <Text style={styles.cardTitle}>
                  {scanResult?.jenis_pinang || "Biji Pinang"}
                </Text>
                <Text style={styles.cardDate}>
                  {scanResult?.created_at 
                    ? new Date(scanResult.created_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short"
                      })
                    : "Baru Saja dipindai"}
                </Text>
              </View>
              <View style={styles.gradeBadge}>
                <Text style={styles.gradeText}>
                  {"Grade " + (scanResult?.grade || "-")}
                </Text>
              </View>
            </View>

            <View>
              <View style={styles.infoRow}>
                <View style={styles.infoRowHeader}>
                  <Text style={styles.infoRowLabel}>
                    {"Persentase Kualitas (AI)"}
                  </Text>
                  <Text style={styles.infoRowValue}>
                    {scanResult?.persentase || "92%"}
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: scanResult?.persentase || "92%" }]} />
                </View>
                <View>
                  <Text style={styles.progressHelperText}>
                    {scanResult?.deskripsi || "Kondisi biji pinang optimal"}
                  </Text>
                </View>
              </View>

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <View style={styles.detailLabelWrapper}>
                    <Text style={styles.detailLabel}>
                      {"KEKERINGAN"}
                    </Text>
                  </View>
                  <Text style={styles.detailValue}>
                    {scanResult?.tingkat_kekeringan || "Kering 90%"}
                  </Text>
                </View>
                <View style={styles.detailItemLast}>
                  <View style={styles.detailLabelWrapper}>
                    <Text style={styles.detailLabel}>
                      {"ESTIMASI HARGA"}
                    </Text>
                  </View>
                  <Text style={styles.detailValueHighlighted}>
                    {finalPrice && !isNaN(parseInt(finalPrice))
                      ? `Rp ${parseInt(finalPrice).toLocaleString("id-ID")}/kg`
                      : (finalPrice || "Hubungi Admin")}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={() => navigation.navigate("HomeArecaNut")}>
              <Text style={styles.saveButtonText}>
                {"Kembali ke Beranda"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.scanButton} onPress={() => navigation.navigate("HomeArecaNut")}>
              <Text style={styles.scanButtonText}>
                {"Pindai Batch Baru"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BottomNavigationBar
        activeTab="home"
        onPressHome={() => navigation.navigate("HomeArecaNut")}
        onPressProfile={() => navigation.navigate("Profile")}
        onPressDetection={() => navigation.navigate("HomeArecaNut", { triggerCamera: true })}
      />
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
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    shadowColor: "#0000000D",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 2,
    elevation: 2,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    width: 32,
    height: 40,
    marginRight: 12,
  },
  headerTitle: {
    color: "#1F1B16",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerRightIcon: {
    width: 32,
    height: 40,
  },
  contentWrapper: {
    marginHorizontal: 16,
    paddingBottom: 89,
  },
  scanImage: {
    height: 268,
    marginBottom: 24,
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E5E5",
    borderRadius: 8,
    borderWidth: 1,
    padding: 21,
    marginBottom: 24,
    shadowColor: "#0000000D",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  titleSection: {
    alignItems: "flex-start",
  },
  cardTitle: {
    color: "#1F1B16",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 3,
  },
  cardDate: {
    color: "#525252",
    fontSize: 14,
  },
  gradeBadge: {
    backgroundColor: "#D4E157",
    borderColor: "#0000000D",
    borderRadius: 9999,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: "#0000000D",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 2,
    elevation: 2,
  },
  gradeText: {
    color: "#33691E",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoRow: {
    marginBottom: 19,
  },
  infoRowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  infoRowLabel: {
    color: "#1F1B16",
    fontSize: 14,
  },
  infoRowValue: {
    color: "#1F1B16",
    fontSize: 14,
  },
  progressBarContainer: {
    backgroundColor: "#E5E5E5",
    borderRadius: 9999,
    paddingRight: 48,
    marginBottom: 4,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#572B18",
    borderRadius: 9999,
  },
  progressHelperText: {
    color: "#737373",
    fontSize: 12,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
  },
  detailItem: {
    flex: 1,
    marginRight: 16,
  },
  detailItemLast: {
    flex: 1,
  },
  detailLabelWrapper: {
    marginBottom: 1,
  },
  detailLabel: {
    color: "#737373",
    fontSize: 12,
  },
  detailValue: {
    color: "#1F1B16",
    fontSize: 18,
    fontWeight: "bold",
  },
  detailValueHighlighted: {
    color: "#572B18",
    fontSize: 18,
    fontWeight: "bold",
  },
  actionsContainer: {
    paddingTop: 28,
  },
  saveButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#572B18",
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 12,
    shadowColor: "#0000001A",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 4,
  },
  saveIcon: {
    borderRadius: 8,
    width: 20,
    height: 20,
    marginRight: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  scanButton: {
    alignItems: "center",
    borderColor: "#572B18",
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 15,
  },
  scanButtonText: {
    color: "#572B18",
    fontSize: 16,
    fontWeight: "bold",
  },
});