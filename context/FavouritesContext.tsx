import { createContext } from "react";

export interface FavouriteItem {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
}

export interface FavouritesContextType {
    favourites: FavouriteItem[];
    toggleFavourite: (item: FavouriteItem) => void;
    isFavourite: (id: string) => boolean;
}

export const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);
