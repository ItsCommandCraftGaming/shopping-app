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
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item}
            />
        </ImageBackground>
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
