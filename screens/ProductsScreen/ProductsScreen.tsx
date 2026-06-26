import useFetch from "@/hooks/useFetch";
import React from "react";
import {
    FlatList,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function HomeScreen() {
    const { data } = useFetch("https://dummyjson.com/products/category-list");

    const renderItem = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity style={styles.item}>
                <View>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                        {item}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ImageBackground
            source={{
                uri: "https://www.everwallpaper.co.uk/cdn/shop/products/11dreamy-pink-paint-mural-wallpaper-plain.jpg?v=1739777834",
            }}
            resizeMode="cover"
            style={styles.container}
        >
            <View>
                <Text style={styles.title}>Products screen</Text>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item}
                numColumns={2}
            />
            <View style={styles.footer}></View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#000000",
        marginHorizontal: 16,
        marginVertical: 10,
    },
    item: {
        flex: 1,
        padding: 30,
        margin: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 1)", // O mică transparență pentru ca fundalul să se vadă frumos
    },
    footer: {
        paddingBottom: 30,
    },
});
