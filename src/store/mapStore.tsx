import { create } from "zustand";

interface MapStoreProps {
    map: maplibregl.Map | null;
    setMap: (map: maplibregl.Map | null) => void;
}

export const useMapStore = create<MapStoreProps>((set) => ({
    map: null,
    setMap: (map) => set({ map })
}))