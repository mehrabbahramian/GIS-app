import { useEffect } from "react";
import maplibregl from 'maplibre-gl';

interface MapLibreProps {
    style: string;
}

function Maplibre(props: MapLibreProps) {

    useEffect(() => {
        const map = new maplibregl.Map({
            container: 'map',
            style: props.style,
            center: [53.6880, 32.4279],
            zoom: 5,
        });

        return () => map.remove()
    }, [props.style])

    return (
        <div id="map" style={{ height: "100vh", width: "100%" }} ></div>
    );
}

export default Maplibre;