import React from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from "@env";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COVER_HEIGHT = 280;

export default function ArticleDetail({ route, navigation }: any) {
  const article = route?.params?.article;

  const getFullImageUrl = (path?: string) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    if (cleanPath.startsWith("/static/")) {
      return `${API_URL}${cleanPath}`;
    }
    return `${API_URL}/static${cleanPath}`;
  };

  const imageUrl =
    getFullImageUrl(article?.gambar) ||
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800";

  const formattedDate = article?.tanggal
    ? new Date(article.tanggal).toLocaleDateString("id-ID", { dateStyle: "long" })
    : "Baru saja";

  const readTime = article?.isi
    ? `${Math.max(1, Math.ceil(article.isi.split(" ").length / 200))} menit baca`
    : "1 menit baca";

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== Hero Image with Overlay ===== */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: imageUrl }} style={styles.coverImage} />
          <View style={styles.heroOverlay} />

          {/* Floating Back Button */}
          <SafeAreaView edges={["top"]} style={styles.floatingHeaderSafe}>
            <View style={styles.floatingHeader}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backIcon}>‹</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Category / Label on the image */}
          <View style={styles.heroBadgeContainer}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>📰 Artikel</Text>
            </View>
          </View>
        </View>

        {/* ===== Content Card (overlapping the hero) ===== */}
        <View style={styles.contentCard}>
          {/* Title */}
          <Text style={styles.articleTitle}>{article?.judul || "Judul Artikel"}</Text>

          {/* Meta Row */}
          <View style={styles.metaContainer}>
            <View style={styles.authorChip}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {(article?.username || "A").charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.authorName}>{article?.username || "Admin"}</Text>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaInfo}>
              <Text style={styles.metaDate}>📅 {formattedDate}</Text>
              <Text style={styles.metaRead}>⏱ {readTime}</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Article Body */}
          <Text style={styles.articleBody}>{article?.isi || "Konten artikel tidak tersedia."}</Text>

          {/* Footer */}
          <View style={styles.footerDivider} />
          <View style={styles.footer}>
            <Text style={styles.footerLabel}>Dipublikasikan oleh</Text>
            <Text style={styles.footerValue}>ArecaNut App</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F5F2",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ── Hero / Cover ──
  heroContainer: {
    width: SCREEN_WIDTH,
    height: COVER_HEIGHT,
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  // ── Floating Header ──
  floatingHeaderSafe: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  floatingHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
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

  // ── Hero Badge ──
  heroBadgeContainer: {
    position: "absolute",
    bottom: 36,
    left: 20,
  },
  heroBadge: {
    backgroundColor: "rgba(87, 43, 24, 0.85)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  heroBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  // ── Content Card ──
  contentCard: {
    marginTop: -24,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 20,
    minHeight: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  articleTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1B",
    lineHeight: 32,
    marginBottom: 16,
  },

  // ── Meta ──
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  authorChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0EBE6",
    borderRadius: 20,
    paddingRight: 12,
    paddingLeft: 4,
    paddingVertical: 4,
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#572B18",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "bold",
  },
  authorName: {
    fontSize: 13,
    color: "#572B18",
    fontWeight: "600",
  },
  metaDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#E0D8D0",
    marginHorizontal: 12,
  },
  metaInfo: {
    flexDirection: "column",
  },
  metaDate: {
    fontSize: 12,
    color: "#737373",
  },
  metaRead: {
    fontSize: 11,
    color: "#A0A0A0",
    marginTop: 2,
  },

  // ── Divider ──
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginBottom: 24,
  },

  // ── Body ──
  articleBody: {
    fontSize: 16,
    lineHeight: 26,
    color: "#3A3A3A",
    textAlign: "justify",
    letterSpacing: 0.2,
  },

  // ── Footer ──
  footerDivider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginTop: 32,
    marginBottom: 16,
  },
  footer: {
    alignItems: "center",
  },
  footerLabel: {
    fontSize: 12,
    color: "#A0A0A0",
  },
  footerValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#572B18",
    marginTop: 2,
  },
});
