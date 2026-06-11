import React from "react";
import { View, ScrollView, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavigationBar from "../../components/BottomNavigationBar";

export default function Profile({ navigation }: any) {
  const handlePress = () => {
    alert("Pressed!");
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {/* Profile Header */}
          <View style={styles.profileHeaderContainer}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarBackground}>
                <Image
                  source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/i38adsu1_expires_30_days.png" }}
                  resizeMode="stretch"
                  style={styles.avatarIcon}
                />
                <Image
                  source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/khzadvtn_expires_30_days.png" }}
                  resizeMode="stretch"
                  style={styles.cameraOverlayIcon}
                />
              </View>
              <Text style={styles.usernameText}>Akun Saya</Text>
              <Text style={styles.updateProfileLink}>Update Profil</Text>
            </View>
          </View>

          {/* Settings Menu Options */}
          <View style={styles.menuContainer}>
            {/* Update Akun */}
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Image
                  source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/bnbz7rmd_expires_30_days.png" }}
                  resizeMode="stretch"
                  style={styles.menuIconUpdateAkun}
                />
                <Text style={styles.menuItemText}>Update Akun</Text>
              </View>
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/VPTfRFh18j/yl90yp24_expires_30_days.png" }}
                resizeMode="stretch"
                style={styles.chevronIcon}
              />
            </View>

            {/* Update Email */}
            <View style={styles.menuItem}>
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
            </View>

            {/* Update Password */}
            <View style={styles.menuItem}>
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
            </View>

            {/* Tentang */}
            <View style={styles.menuItem}>
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
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handlePress}>
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
    paddingTop: 30,
    marginBottom: 12,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarIcon: {
    borderRadius: 9999,
    width: 20,
    height: 20,
    marginBottom: 13,
  },
  cameraOverlayIcon: {
    borderRadius: 9999,
    width: 16,
    height: 17,
    position: "absolute",
    bottom: 15,
    right: 15,
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
});