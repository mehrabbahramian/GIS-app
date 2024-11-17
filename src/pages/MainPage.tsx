import { useState } from "react";
import Maplibre from "../components/Maplibre";
import SidebarLayout from "../components/SidebarLayout";

function MainPage() {
    const [mapStyle, setMapStyle] = useState<string>("https://api.maptiler.com/maps/streets-v2/style.json?key=QOBZwJCNf0crlImWg4V6")

    return (
        <SidebarLayout onStyleChange={setMapStyle}>
            <Maplibre style={mapStyle} />
        </SidebarLayout>
    );
}

export default MainPage;