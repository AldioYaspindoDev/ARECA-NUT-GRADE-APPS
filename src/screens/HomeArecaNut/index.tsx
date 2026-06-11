import React from "react";
import { View, ScrollView, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavigationBar from "../../components/BottomNavigationBar";

interface HistoryItem {
  id: string;
  title: string;
  date: string;
}

const HISTORY_DATA: HistoryItem[] = [
  { id: "1", title: "Image-areca-atechu-01.jpg", date: "04/14/2026 12.00" },
  { id: "2", title: "Image-areca-atechu-01.jpg", date: "04/14/2026 12.00" },
];

export default function HomeArecaNut({ navigation }: any) {
  const handlePress = () => {
    alert("Pressed!");
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Menu */}
        <View style={styles.headerContainer}>
          {/* Upload Button */}
          <View style={styles.headerItemWrapper}>
            <TouchableOpacity style={styles.headerIconButton} onPress={handlePress}>
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/29pn09sv_expires_30_days.png" }}
                resizeMode="stretch"
                style={styles.uploadIcon}
              />
            </TouchableOpacity>
            <Text style={styles.headerItemText}>Upload</Text>
          </View>

          {/* Kamera Button */}
          <View style={styles.headerItemWrapper}>
            <TouchableOpacity style={styles.headerIconButton} onPress={handlePress}>
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/awbb2u5k_expires_30_days.png" }}
                resizeMode="stretch"
                style={styles.cameraIcon}
              />
            </TouchableOpacity>
            <Text style={styles.headerItemText}>Kamera</Text>
          </View>

          {/* Riwayat Button */}
          <View style={[styles.headerItemWrapper, styles.riwayatMargin]}>
            <TouchableOpacity style={styles.headerIconButton} onPress={handlePress}>
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/tkmr3j74_expires_30_days.png" }}
                resizeMode="stretch"
                style={styles.historyIcon}
              />
            </TouchableOpacity>
            <Text style={styles.headerItemText}>Riwayat</Text>
          </View>

          {/* Pantau Harga Button */}
          <View style={styles.headerLastItemWrapper}>
            <TouchableOpacity style={styles.headerIconButton} onPress={handlePress}>
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/b4heou8h_expires_30_days.png" }}
                resizeMode="stretch"
                style={styles.pantauHargaIcon}
              />
            </TouchableOpacity>
            <View style={styles.centerAlign}>
              <Text style={styles.headerLastItemText}>{"Pantau\nHarga"}</Text>
            </View>
          </View>
        </View>

        {/* History Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Riwayat</Text>
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
            {HISTORY_DATA.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.historyCard,
                  index < HISTORY_DATA.length - 1 && styles.historyCardMargin,
                ]}
              >
                <View style={styles.historyImagePlaceholder} />
                <View style={styles.historyContentContainer}>
                  <View style={styles.historyTitleWrapper}>
                    <Text style={styles.historyTitleText}>{item.title}</Text>
                  </View>
                  <View>
                    <Text style={styles.historyDateText}>{item.date}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Related Articles Section */}
        <View style={styles.articlesSectionContainer}>
          <View style={styles.sectionTitleWrapper}>
            <Text style={styles.sectionTitle}>Artikel Terkait</Text>
          </View>
          <View>
            {/* Row 1 */}
            <View style={styles.articleRow}>
              <View style={[styles.articleCard, styles.marginRight16]} />
              <View style={styles.articleCard} />
            </View>
            {/* Row 2 */}
            <View style={styles.articleRow}>
              <View style={[styles.articleCard, styles.marginRight16]} />
              <View style={styles.articleCard} />
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Reusable Bottom Navigation Bar pinned to the bottom */}
      <BottomNavigationBar
        activeTab="home"
        onPressHome={() => navigation.navigate("HomeArecaNut")}
        onPressProfile={() => navigation.navigate("Register")}
        onPressDetection={() => navigation.navigate("OutputResultScan")}
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
    backgroundColor: "#C99B82",
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
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
  headerItemWrapper: {
    flex: 1,
    alignItems: "center",
    marginRight: 29,
  },
  riwayatMargin: {
    marginRight: 28,
  },
  headerLastItemWrapper: {
    flex: 1,
  },
  headerIconButton: {
    alignSelf: "stretch",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#A77A61",
    borderWidth: 1.5,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 3,
  },
  uploadIcon: {
    borderRadius: 8,
    width: 18,
    height: 18,
  },
  cameraIcon: {
    borderRadius: 8,
    width: 19,
    height: 17,
  },
  historyIcon: {
    borderRadius: 8,
    width: 18,
    height: 18,
  },
  pantauHargaIcon: {
    borderRadius: 8,
    width: 22,
    height: 13,
  },
  headerItemText: {
    color: "#1C1C1B",
    fontSize: 12,
  },
  centerAlign: {
    alignItems: "center",
  },
  headerLastItemText: {
    color: "#1C1C1B",
    fontSize: 12,
    textAlign: "center",
    width: 37,
  },
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
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#CAC6C4",
    borderRadius: 8,
    borderWidth: 1,
    padding: 13,
    shadowColor: "#0000000D",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 2,
    elevation: 2,
  },
  historyCardMargin: {
    marginBottom: 12,
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
  },
  historyDateText: {
    color: "#484745",
    fontSize: 12,
  },
  separator: {
    height: 1,
    marginBottom: 24,
    marginHorizontal: 16,
  },
  articlesSectionContainer: {
    marginBottom: 32,
    marginHorizontal: 16,
  },
  sectionTitleWrapper: {
    marginBottom: 16,
  },
  articleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  articleCard: {
    height: 192,
    flex: 1,
    backgroundColor: "#DADAD8",
    borderRadius: 8,
  },
  marginRight16: {
    marginRight: 16,
  },
});