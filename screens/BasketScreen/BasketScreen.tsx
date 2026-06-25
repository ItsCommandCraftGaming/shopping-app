import useFetch from "@/hooks/useFetch";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BasketScreen() {
    const { data } = useFetch("https://dummyjson.com/products/category-list");

    return (
        <TouchableOpacity style={styles.item}>
            <View>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    {"test"}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    item: {
        borderBottomWidth: 5,
        borderWidth: 2,
        padding: 16,
        margin: 8,
        borderBottomColor: "#000000",
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.8)", // O mică transparență pentru ca fundalul să se vadă frumos
    },
});
