import React, { useEffect, useState, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavigationBar from "../../components/BottomNavigationBar";
import * as ImagePicker from "expo-image-picker";
import { getArticles, Article } from "@/services/articleService";
import { getScanHistory, scanPinang, HistoryItem, getPrices, HargaItem } from "@/services/pinangService";
import { API_URL } from "@env";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CAROUSEL_PADDING = 16;
const CAROUSEL_SLIDE_WIDTH = SCREEN_WIDTH - CAROUSEL_PADDING * 2;

  // Daftarkan gambar lokal di sini
const CAROUSEL_ITEMS = [
  { id: 1, image: require("@/assets/Carrousel1.png") },
  { id: 2, image: require("@/assets/Carrousel2.png") },
  { id: 3, image: require("@/assets/Carrousel3.png") },
];

export default function HomeArecaNut({ navigation, route }: any) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [prices, setPrices] = useState<HargaItem[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleOpenPrices = async () => {
    setShowPriceModal(true);
    setLoadingPrices(true);
    try {
      const priceData = await getPrices();
      setPrices(priceData);
    } catch (error) {
      console.error("Gagal mengambil harga acuan:", error);
      Alert.alert("Gagal", "Tidak dapat mengambil data harga saat ini.");
    } finally {
      setLoadingPrices(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (route.params?.triggerCamera) {
      navigation.setParams({ triggerCamera: undefined });
      handlePickImage(true);
    }
  }, [route.params?.triggerCamera]);

  const fetchData = async () => {
    try {
      setLoadingArticles(true);
      const articleData = await getArticles(0, 4);
      setArticles(articleData);
    } catch (error) {
      console.error("Gagal memuat artikel:", error);
    } finally {
      setLoadingArticles(false);
    }

    try {
      setLoadingHistory(true);
      const historyData = await getScanHistory(0, 3);
      setHistory(historyData);
    } catch (error) {
      console.error("Gagal memuat riwayat:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const getFullImageUrl = (path?: string) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    if (cleanPath.startsWith("/static/")) {
      return `${API_URL}${cleanPath}`;
    }
    return `${API_URL}/static${cleanPath}`;
  };

  const handlePickImage = async (useCamera: boolean) => {
    try {
      const permissionResult = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert("Izin Ditolak", `Aplikasi membutuhkan izin ${useCamera ? "kamera" : "galeri"} untuk memindai pinang.`);
        return;
      }

      const pickerResult = useCamera
        ? await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 })
        : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.8 });

      if (pickerResult.canceled || !pickerResult.assets || pickerResult.assets.length === 0) {
        return;
      }

      const imageUri = pickerResult.assets[0].uri;
      await uploadAndScanImage(imageUri);
    } catch (error) {
      console.error("Gagal mengambil gambar:", error);
      Alert.alert("Error", "Gagal mengambil gambar.");
    }
  };

  const uploadAndScanImage = async (imageUri: string) => {
    setIsScanning(true);
    try {
      const formData = new FormData();
      const filename = imageUri.split("/").pop() || "scan_pinang.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const fileType = match ? match[1] : "jpg";

      formData.append("file", {
        uri: imageUri,
        name: filename,
        type: `image/${fileType === "png" ? "png" : "jpeg"}`,
      } as any);

      formData.append("lokasi", "Padang, Indonesia");
      formData.append("perangkat", "Mobile Device");
      formData.append("catatan", "Auto-scan");

      const result = await scanPinang(formData);
      fetchData();
      navigation.navigate("OutputResultScan", { scanResult: result, localImageUri: imageUri });
    } catch (error: any) {
      console.error("Scan error:", error);
      const detail = error.response?.data?.detail;
      let displayMessage = "Tidak dapat menghubungi server backend.";
      
      if (detail) {
        if (typeof detail === "string") {
          displayMessage = detail;
        } else if (typeof detail === "object") {
          displayMessage = detail.message || detail.error || JSON.stringify(detail);
          if (detail.hint) {
            displayMessage += `\n\nHint: ${detail.hint}`;
          }
        }
      } else if (error.response?.data?.message) {
        displayMessage = error.response.data.message;
      } else if (error.message) {
        displayMessage = error.message;
      }
      
      Alert.alert("Gagal Memindai", displayMessage);
    } finally {
      setIsScanning(false);
    }
  };

  const handleArticlePress = (article: Article) => {
    navigation.navigate("ArticleDetail", { article });
  };

  const onCarouselScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / CAROUSEL_SLIDE_WIDTH);
    setActiveSlide(index);
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      {isScanning && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#572B18" />
          <Text style={styles.loadingText}>Sedang Menganalisis Biji Pinang...</Text>
        </View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* ===== Top Branding ===== */}
        <View style={styles.brandingContainer}>
          <Image source={require("@/assets/logo.png")} style={styles.logo} />
          <Text style={styles.appName}>ArecaNut</Text>
        </View>

        {/* ===== Menu Card (one big card wrapping original row) ===== */}
        <View style={styles.menuCard}>
          <View style={styles.menuRow}>
            {/* Upload */}
            <View style={styles.menuItem}>
              <TouchableOpacity style={styles.menuIconButton} onPress={() => handlePickImage(false)}>
                <Image
                  source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/29pn09sv_expires_30_days.png" }}
                  resizeMode="stretch"
                  style={styles.menuIconImg}
                />
              </TouchableOpacity>
              <Text style={styles.menuLabel}>Upload</Text>
            </View>

            {/* Kamera */}
            <View style={styles.menuItem}>
              <TouchableOpacity style={styles.menuIconButton} onPress={() => handlePickImage(true)}>
                <Image
                  source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/awbb2u5k_expires_30_days.png" }}
                  resizeMode="stretch"
                  style={styles.menuIconImg}
                />
              </TouchableOpacity>
              <Text style={styles.menuLabel}>Kamera</Text>
            </View>

            {/* Riwayat */}
            <View style={styles.menuItem}>
              <TouchableOpacity style={styles.menuIconButton} onPress={() => navigation.navigate("HistoryScan")}>
                <Image
                  source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/tkmr3j74_expires_30_days.png" }}
                  resizeMode="stretch"
                  style={styles.menuIconImg}
                />
              </TouchableOpacity>
              <Text style={styles.menuLabel}>Riwayat</Text>
            </View>

            {/* Harga */}
            <View style={styles.menuItem}>
              <TouchableOpacity style={styles.menuIconButton} onPress={handleOpenPrices}>
                <Image
                  source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/b4heou8h_expires_30_days.png" }}
                  resizeMode="stretch"
                  style={styles.menuIconImg}
                />
              </TouchableOpacity>
              <Text style={styles.menuLabel}>Harga</Text>
            </View>
          </View>
        </View>

                {/* ===== Ad Carousel ===== */}
        <View style={styles.carouselWrapper}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onCarouselScroll}
            scrollEventThrottle={16}
            style={styles.carousel}
          >
            {CAROUSEL_ITEMS.map((item) => (
              <View key={item.id} style={styles.carouselSlide}>
                <Image 
                  source={item.image} 
                  style={{ 
                    width: '100%', 
                    height: 130, 
                    borderRadius: 12, 
                    resizeMode: 'cover' 
                  }} 
                />
              </View>
            ))}
          </ScrollView>
          
          {/* Dots indicator */}
          <View style={styles.dotsContainer}>
            {CAROUSEL_ITEMS.map((_, i) => (
              <View key={i} style={[styles.dot, activeSlide === i && styles.dotActive]} />
            ))}
          </View>
        </View>


        {/* ===== History Section ===== */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Riwayat Terbaru</Text>
            <View style={styles.nextContainer}>
              <TouchableOpacity onPress={() => navigation.navigate("HistoryScan")}>
                <Text style={styles.nextText}>Selanjutnya</Text>
              </TouchableOpacity>
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/2phx3wtp_expires_30_days.png" }}
                resizeMode="stretch"
                style={styles.nextIcon}
              />
            </View>
          </View>

          <View>
            {loadingHistory ? (
              <ActivityIndicator size="small" color="#572B18" style={{ marginVertical: 20 }} />
            ) : history.length === 0 ? (
              <Text style={styles.emptyText}>Belum ada riwayat pemindaian pinang.</Text>
            ) : (
              history.map((item, index) => {
                const imageUrl = getFullImageUrl(item.pinang?.gambar);
                return (
                  <TouchableOpacity
                    key={item.id}
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
                    style={[styles.historyCard, index < history.length - 1 && styles.historyCardMargin]}
                  >
                    {imageUrl ? (
                      <Image source={{ uri: imageUrl }} style={styles.historyImage} />
                    ) : (
                      <View style={styles.historyImagePlaceholder} />
                    )}
                    <View style={styles.historyContentContainer}>
                      <View style={styles.historyTitleWrapper}>
                        <Text style={styles.historyTitleText}>
                          {item.pinang?.jenis_pinang || "Pinang"} - Grade {item.grade}
                        </Text>
                      </View>
                      <View style={styles.historyMetaWrapper}>
                        <Text style={styles.historyDateText}>
                          {new Date(item.created_at).toLocaleString("id-ID", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </Text>
                        <Text style={styles.historyPriceText}>
                          Rp {parseInt(item.harga_per_kg).toLocaleString("id-ID")}/kg
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* ===== Related Articles Section ===== */}
        <View style={styles.articlesSectionContainer}>
          <View style={styles.sectionTitleWrapper}>
            <Text style={styles.sectionTitle}>Artikel Terkait</Text>
          </View>
          <View>
            {loadingArticles ? (
              <ActivityIndicator size="small" color="#572B18" style={{ marginVertical: 20 }} />
            ) : articles.length === 0 ? (
              <Text style={styles.emptyText}>Belum ada artikel seputar pinang.</Text>
            ) : (
              <View style={styles.articleGrid}>
                {articles.map((article) => {
                  const articleImageUrl =
                    getFullImageUrl(article.gambar) || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400";
                  return (
                    <TouchableOpacity
                      key={article.id}
                      style={styles.articleCard}
                      onPress={() => handleArticlePress(article)}
                    >
                      <Image source={{ uri: articleImageUrl }} style={styles.articleImage} />
                      <View style={styles.articleContent}>
                        <Text numberOfLines={2} style={styles.articleTitle}>
                          {article.judul}
                        </Text>
                        <Text numberOfLines={3} style={styles.articleSummary}>
                          {article.isi}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigationBar
        activeTab="home"
        onPressHome={() => navigation.navigate("HomeArecaNut")}
        onPressProfile={() => navigation.navigate("Profile")}
        onPressDetection={() => handlePickImage(true)}
      />

      {/* ===== Modal Pantau Harga ===== */}
      <Modal
        visible={showPriceModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPriceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Harga Acuan Terkini</Text>
              <TouchableOpacity onPress={() => setShowPriceModal(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {loadingPrices ? (
              <ActivityIndicator size="large" color="#572B18" style={{ marginVertical: 32 }} />
            ) : prices.length === 0 ? (
              <Text style={styles.emptyText}>Data harga tidak tersedia.</Text>
            ) : (
              <ScrollView style={styles.priceList}>
                {prices.map((item) => (
                  <View key={item.id} style={styles.priceCard}>
                    <View style={styles.priceCardHeader}>
                      <View style={styles.priceGradeBadge}>
                        <Text style={styles.priceGradeText}>Grade {item.grade}</Text>
                      </View>
                      <Text style={styles.priceValText}>
                        Rp {parseInt(item.harga).toLocaleString("id-ID")}/kg
                      </Text>
                    </View>
                    {item.keterangan ? <Text style={styles.priceDescText}>{item.keterangan}</Text> : null}
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // ── Branding ──
  brandingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: "contain",
  },
  appName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#572B18",
  },

  // ── Menu Card (wraps all 4 icons in one card) ──
  menuCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    backgroundColor: "#572B18",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuItem: {
    flex: 1,
    alignItems: "center",
  },
  menuIconButton: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#A77A61",
    borderWidth: 1.5,
    borderRadius: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIconImg: {
    width: 20,
    height: 20,
  },
  menuLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  // ── Ad Carousel ──
  carouselWrapper: {
    marginBottom: 20,
  },
  carousel: {
    paddingLeft: CAROUSEL_PADDING,
  },
  carouselSlide: {
    width: CAROUSEL_SLIDE_WIDTH,
    paddingRight: CAROUSEL_PADDING,
  },
  adPlaceholder: {
    height: 130,
    backgroundColor: "#F0EBE6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0D8D0",
  },
  adText: {
    color: "#A09080",
    fontSize: 14,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D0C8C0",
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: "#572B18",
    width: 20,
    borderRadius: 4,
  },

  // ── Sections ──
  sectionContainer: {
    paddingBottom: 8,
    marginBottom: 24,
    marginHorizontal: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#1C1C1B",
    fontSize: 16,
    fontWeight: "bold",
  },
  nextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  nextText: {
    color: "#484745",
    fontSize: 12,
    marginRight: 5,
  },
  nextIcon: {
    width: 4,
    height: 8,
  },

  // ── History Cards ──
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#CAC6C4",
    borderRadius: 12,
    borderWidth: 1,
    padding: 13,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  historyCardMargin: {
    marginBottom: 12,
  },
  historyImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 16,
  },
  historyImagePlaceholder: {
    width: 64,
    height: 64,
    backgroundColor: "#DADAD8",
    borderRadius: 8,
    marginRight: 16,
  },
  historyContentContainer: {
    flex: 1,
  },
  historyTitleWrapper: {
    marginBottom: 4,
  },
  historyTitleText: {
    color: "#1C1C1B",
    fontSize: 14,
    fontWeight: "bold",
  },
  historyMetaWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyDateText: {
    color: "#484745",
    fontSize: 12,
  },
  historyPriceText: {
    color: "#572B18",
    fontSize: 12,
    fontWeight: "bold",
  },

  // ── Separator ──
  separator: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginBottom: 24,
    marginHorizontal: 16,
  },

  // ── Articles ──
  articlesSectionContainer: {
    marginBottom: 32,
    marginHorizontal: 16,
  },
  sectionTitleWrapper: {
    marginBottom: 16,
  },
  articleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  articleCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E5E5",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  articleImage: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  articleContent: {
    padding: 8,
  },
  articleTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1C1C1B",
    marginBottom: 4,
  },
  articleSummary: {
    fontSize: 10,
    color: "#737373",
  },

  // ── Empty / Loading ──
  emptyText: {
    color: "#737373",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 16,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#572B18",
    fontSize: 16,
    fontWeight: "bold",
  },

  // ── Price Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "75%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C1C1B",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#737373",
  },
  priceList: {
    marginBottom: 20,
  },
  priceCard: {
    backgroundColor: "#FAF8F6",
    borderColor: "#E5E5E5",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  priceCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceGradeBadge: {
    backgroundColor: "#EFEBE9",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  priceGradeText: {
    color: "#572B18",
    fontWeight: "bold",
    fontSize: 14,
  },
  priceValText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#572B18",
  },
  priceDescText: {
    fontSize: 12,
    color: "#737373",
    marginTop: 8,
  },
});