import React, { useEffect, useRef } from "react";
import maplibregl from 'maplibre-gl';
import Swal from "sweetalert2";
import { Button } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

interface MapLibreProps {
    style: string;
}

function Maplibre(props: MapLibreProps) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: props.style,
            center: [53.6880, 32.4279],
            zoom: 5,
        });

        return () => map.current?.remove()
    }, [props.style])

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            Swal.fire({
                title: "No file selected!",
                icon: "error"
            })
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const geoJson = JSON.parse(content);

                if (geoJson.type !== "FeatureCollection") {
                    Swal.fire({
                        title: "Invalid GeoJson File!",
                        icon: "error"
                    })
                    return;
                }

                const sourceId = `geoJson-${Date.now()}`;
                if (map.current?.getSource(sourceId)) {
                    map.current.removeLayer(sourceId);
                    map.current.removeSource(sourceId);
                }
                map.current?.addSource(sourceId, {
                    type: "geojson",
                    data: geoJson
                });
                map.current?.addLayer({
                    id: sourceId,
                    type: "circle",
                    source: sourceId,
                    paint: {
                        "circle-radius": 6,
                        "circle-color": "#FF5722",
                    }
                });
                const bounds = new maplibregl.LngLatBounds();
                geoJson.features.forEach((feature: any) => {
                    const coordinates = feature.geometry.coordinates;

                    if (feature.geometry.type === "Point") {
                        bounds.extend(coordinates);
                    } else if (
                        feature.geometry.type === "Polygon" ||
                        feature.geometry.type === "MultiPolygon"
                    ) {
                        feature.geometry.coordinates.forEach((ring: [number, number][]) => {
                            ring.forEach((coord) => {
                                bounds.extend(coord);
                            });
                        });
                    } else if (
                        feature.geometry.type === "LineString" ||
                        feature.geometry.type === "MultiLineString"
                    ) {
                        coordinates.forEach((coord: [number, number]) => {
                            bounds.extend(coord);
                        });
                    }
                });

                if (!bounds.isEmpty()) {
                    map.current?.fitBounds(bounds, { padding: 20, maxZoom: 15 });
                }

                Swal.fire({
                    title: "GeoJson layer added to the map!",
                    icon: "success"
                })
            } catch (error) {
                Swal.fire({
                    title: "Error parsing GeoJson file!",
                    icon: "error"
                })
            };
        }
        reader.readAsText(file);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ padding: '10px', background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUpload />}
                >
                    Upload GeoJson File
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        style={{ display: "none" }}
                    />
                </Button>
            </div>
            <div
                ref={mapContainer}
                style={{
                    flexGrow: 1,
                    height: '100vh',
                    width: '100vw',
                }}
            />
        </div>
    );
}

export default Maplibre;