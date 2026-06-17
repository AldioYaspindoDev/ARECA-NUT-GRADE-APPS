import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getScanHistory, HistoryItem } from "@/services/pinangService";
import { API_URL } from "@env";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function HistoryScan({ navigation }: any) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

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
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getScanHistory(0, 100);
      setHistory(data);
    } catch (error) {
      console.error("Gagal memuat riwayat lengkap:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade?.toUpperCase()) {
      case "A":
        return { bg: "#E8F5E9", text: "#2E7D32", border: "#A5D6A7" };
      case "B":
        return { bg: "#FFF8E1", text: "#F57F17", border: "#FFE082" };
      case "C":
        return { bg: "#FBE9E7", text: "#D84315", border: "#FFAB91" };
      default:
        return { bg: "#F5F5F5", text: "#616161", border: "#E0E0E0" };
    }
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Riwayat Pemindaian</Text>
          <Text style={styles.subtitle}>
            {loading ? "Memuat..." : `${history.length} hasil pemindaian`}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#572B18" />
            <Text style={styles.loadingText}>Memuat riwayat...</Text>
          </View>
        ) : history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>Belum Ada Riwayat</Text>
            <Text style={styles.emptyText}>
              Mulai pindai biji pinang untuk melihat riwayat di sini.
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.goBack()}>
              <Text style={styles.emptyButtonText}>Mulai Pindai</Text>
            </TouchableOpacity>
          </View>
        ) : (
          history.map((item, index) => {
            const imageUrl = getFullImageUrl(item.pinang?.gambar);
            const gradeColor = getGradeColor(item.grade);

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate("OutputResultScan", {
                    scanResult: {
                      pinang_id: item.pinang_id,
                      grade: item.grade,
                      jenis_pinang: item.pinang?.jenis_pinang || "Pinang",
                      tingkat_kekeringan: item.pinang?.tingkat_kekeringan || "-",
                      deskripsi: item.pinang?.deskripsi,
                      persentase: item.pinang?.persentase,
                      gambar: item.pinang?.gambar,
                      harga_per_kg: item.harga_per_kg,
                      keterangan_harga: item.keterangan_harga,
                      history_id: item.id,
                      created_at: item.created_at,
                    },
                  })
                }
                style={styles.card}
              >
                {/* Image */}
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.cardImage} />
                ) : (
                  <View style={styles.cardImagePlaceholder}>
                    <Text style={styles.placeholderEmoji}>🥜</Text>
                  </View>
                )}

                {/* Content */}
                <View style={styles.cardBody}>
                  <View style={styles.cardTopRow}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {item.pinang?.jenis_pinang || "Pinang"}
                    </Text>
                    <View style={[styles.gradeBadge, { backgroundColor: gradeColor.bg, borderColor: gradeColor.border }]}>
                      <Text style={[styles.gradeText, { color: gradeColor.text }]}>
                        Grade {item.grade}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardInfoRow}>
                    <Text style={styles.dateText}>
                      📅{" "}
                      {new Date(item.created_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </Text>
                  </View>

                  <View style={styles.cardBottomRow}>
                    <Text style={styles.priceText}>
                      Rp {parseInt(item.harga_per_kg).toLocaleString("id-ID")}/kg
                    </Text>
                    {item.pinang?.tingkat_kekeringan && (
                      <View style={styles.kekeringanBadge}>
                        <Text style={styles.kekeringanText}>💧 {item.pinang.tingkat_kekeringan}</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Chevron */}
                <View style={styles.chevronContainer}>
                  <Text style={styles.chevron}>›</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        {/* Bottom spacer */}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F5F2",
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#C99B82",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: -2,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    marginTop: 2,
  },

  // ── ScrollView ──
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },

  // ── Loading ──
  loadingContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  loadingText: {
    color: "#737373",
    fontSize: 14,
    marginTop: 12,
  },

  // ── Empty State ──
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1B",
    marginBottom: 8,
  },
  emptyText: {
    color: "#737373",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: "#572B18",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },

  // ── Card ──
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  cardImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#F0EBE6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderEmoji: {
    fontSize: 28,
  },

  // ── Card Body ──
  cardBody: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1C1C1B",
    flex: 1,
    marginRight: 8,
  },
  gradeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  gradeText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  cardInfoRow: {
    marginTop: 4,
  },
  dateText: {
    fontSize: 11,
    color: "#999",
  },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  priceText: {
    fontSize: 14,
    color: "#572B18",
    fontWeight: "bold",
  },
  kekeringanBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  kekeringanText: {
    fontSize: 10,
    color: "#1565C0",
  },

  // ── Chevron ──
  chevronContainer: {
    justifyContent: "center",
    paddingLeft: 4,
  },
  chevron: {
    fontSize: 22,
    color: "#C0B8B0",
    fontWeight: "bold",
  },
});