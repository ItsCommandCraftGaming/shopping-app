import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FavouritesContext, FavouriteItem } from "./FavouritesContext";

const FAVOURITES_STORAGE_KEY = "@favourites_items";

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
    const [favourites, setFavourites] = useState<FavouriteItem[]>([]);

    useEffect(() => {
        loadFavourites();
    }, []);

    const loadFavourites = async () => {
        try {
            const stored = await AsyncStorage.getItem(FAVOURITES_STORAGE_KEY);
            if (stored) {
                setFavourites(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Failed to load favourites", error);
        }
    };

    const saveFavourites = async (newItems: FavouriteItem[]) => {
        setFavourites(newItems);
        try {
            await AsyncStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(newItems));
        } catch (error) {
            console.error("Failed to save favourites", error);
        }
    };

    const toggleFavourite = (item: FavouriteItem) => {
        const isFav = favourites.some((fav) => fav.id === item.id);
        if (isFav) {
            saveFavourites(favourites.filter((fav) => fav.id !== item.id));
        } else {
            saveFavourites([...favourites, item]);
        }
    };

    const isFavourite = (id: string) => {
        return favourites.some((fav) => fav.id === id);
    };

    return (
        <FavouritesContext.Provider value={{ favourites, toggleFavourite, isFavourite }}>
            {children}
        </FavouritesContext.Provider>
    );
}
