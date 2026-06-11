import React from "react";
import { View, ScrollView, Text, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default () => {
	return (
		<SafeAreaView 
			style={{
				flex: 1,
				backgroundColor: "#FFFFFF",
			}}>
			<ScrollView  
				style={{
					flex: 1,
					backgroundColor: "#FFFFFF",
					paddingTop: 44,
				}}>
				<View 
					style={{
						backgroundColor: "#F9F9F7",
						paddingVertical: 20,
						paddingHorizontal: 24,
						marginBottom: 48,
					}}>
					<Text 
						style={{
							color: "#1C1B1B",
							fontSize: 24,
							fontWeight: "bold",
						}}>
						{"History"}
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}