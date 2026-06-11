import React from "react";
import { View, ScrollView, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavigationBar from "@/components/BottomNavigationBar";

export default function OutputResultScan({ navigation }: any) {
  const handlePress = () => {
    alert("Pressed!");
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/tf2uy9r8_expires_30_days.png" }}
              resizeMode="stretch"
              style={styles.headerLogo}
            />
            <Text style={styles.headerTitle}>
              {"Analysis Result"}
            </Text>
          </View>
          <Image
            source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/6un8c5o3_expires_30_days.png" }}
            resizeMode="stretch"
            style={styles.headerRightIcon}
          />
        </View>

        <View style={styles.contentWrapper}>
          <Image
            source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/8c1ew86x_expires_30_days.png" }}
            resizeMode="stretch"
            style={styles.scanImage}
          />

          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <View style={styles.titleSection}>
                <Text style={styles.cardTitle}>
                  {"Arabica Beans"}
                </Text>
                <Text style={styles.cardDate}>
                  {"Scanned on Oct 24, 2023"}
                </Text>
              </View>
              <TouchableOpacity style={styles.gradeBadge} onPress={handlePress}>
                <Text style={styles.gradeText}>
                  {"Grade A"}
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <View style={styles.infoRow}>
                <View style={styles.infoRowHeader}>
                  <Text style={styles.infoRowLabel}>
                    {"Moisture Content"}
                  </Text>
                  <Text style={styles.infoRowValue}>
                    {"11.5%"}
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar} />
                </View>
                <View>
                  <Text style={styles.progressHelperText}>
                    {"Optimal range for storage"}
                  </Text>
                </View>
              </View>

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <View style={styles.detailLabelWrapper}>
                    <Text style={styles.detailLabel}>
                      {"DEFECT COUNT"}
                    </Text>
                  </View>
                  <Text style={styles.detailValue}>
                    {"2 / 100g"}
                  </Text>
                </View>
                <View style={styles.detailItemLast}>
                  <View style={styles.detailLabelWrapper}>
                    <Text style={styles.detailLabel}>
                      {"EST. VALUE"}
                    </Text>
                  </View>
                  <Text style={styles.detailValueHighlighted}>
                    {"$4.50/lb"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handlePress}>
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/bcjjd5sb_expires_30_days.png" }}
                resizeMode="stretch"
                style={styles.saveIcon}
              />
              <Text style={styles.saveButtonText}>
                {"Save to Inventory"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.scanButton} onPress={handlePress}>
              <Text style={styles.scanButtonText}>
                {"Scan Another Batch"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    alignItems: "center",
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