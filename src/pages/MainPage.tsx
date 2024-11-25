import { useState } from "react";
import Maplibre from "../components/Maplibre";
import SidebarLayout from "../components/SidebarLayout";

function MainPage() {
    const [mapStyle, setMapStyle] = useState<string>("https://api.maptiler.com/maps/streets-v2/style.json?key=QOBZwJCNf0crlImWg4V6");
    const [drawStyles, setDrawStyles] = useState({});

    const handleStyleChange = (newStyles: any) => {
        setDrawStyles(newStyles);
    };

    return (
        <SidebarLayout onStyleChange={setMapStyle} onToggleLayerVisibility={() => { }} onDrawStyleChange={handleStyleChange}>
            <Maplibre style={mapStyle} onDrawStyleChange={(updateStyles) => updateStyles(drawStyles)} />
        </SidebarLayout>
    );
}

export default MainPage;