import React, { useEffect, useRef } from "react";
import maplibregl from 'maplibre-gl';
import Swal from "sweetalert2";
import { Button } from "@mui/material";
import { CloudUpload, Delete, Hexagon, PanoramaFishEye, PanTool, Rectangle, ShowChart } from "@mui/icons-material";
import { TerraDraw, TerraDrawCircleMode, TerraDrawFreehandMode, TerraDrawLineStringMode, TerraDrawMapLibreGLAdapter, TerraDrawPolygonMode, TerraDrawRectangleMode } from "terra-draw";

interface MapLibreProps {
    style: string;
}

const controlModes = [
    {
        id: 1,
        name: "Freehand",
        mode: "freehand",
        icon: <PanTool />
    },
    {
        id: 2,
        name: "Polygon",
        mode: "polygon",
        icon: <Hexagon />
    },
    {
        id: 3,
        name: "Rectangle",
        mode: "rectangle",
        icon: <Rectangle />
    },
    {
        id: 4,
        name: "Circle",
        mode: "circle",
        icon: <PanoramaFishEye />
    },
    {
        id: 5,
        name: "Line",
        mode: "linestring",
        icon: <ShowChart />
    },
    {
        id: 6,
        name: "",
        mode: "",
        icon: <Delete />
    }
]

function Maplibre(props: MapLibreProps) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const drawRef = useRef<TerraDraw | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: props.style,
            center: [53.6880, 32.4279],
            zoom: 5,
        });

        mapRef.current = map;

        const draw = new TerraDraw({
            adapter: new TerraDrawMapLibreGLAdapter({ map }),
            modes: [
                new TerraDrawFreehandMode(),
                new TerraDrawPolygonMode(),
                new TerraDrawRectangleMode(),
                new TerraDrawCircleMode(),
                new TerraDrawLineStringMode()
            ],
        })

        draw.start();
        drawRef.current = draw;
        draw.setMode("freehand");

        return () => mapRef.current?.remove()
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
                const sourceFileName = file.name;
                const savedFiles = JSON.parse(localStorage.getItem("geojsonfiles") || "[]");
                savedFiles.push({ id: sourceId, name: sourceFileName, data: geoJson });
                localStorage.setItem("geojsonfiles", JSON.stringify(savedFiles))

                if (mapRef.current?.getSource(sourceId)) {
                    mapRef.current.removeLayer(sourceId);
                    mapRef.current.removeSource(sourceId);
                }
                mapRef.current?.addSource(sourceId, {
                    type: "geojson",
                    data: geoJson
                });
                mapRef.current?.addLayer({
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
                    mapRef.current?.fitBounds(bounds, { padding: 20, maxZoom: 15 });
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

    const handleDrawModeChange = (mode: string) => {
        if (drawRef.current) {
            drawRef.current.setMode(mode);
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
            <div
                style={{
                    position: "absolute",
                    width: "100%",
                    top: 70,
                    left: 0,
                    zIndex: 1000,
                    backgroundColor: "transparent",
                    borderRadius: "8px",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px"
                }}
            >
                {
                    controlModes.map((mode) => {
                        return (
                            <Button variant="contained" onClick={() => handleDrawModeChange(mode.mode)} key={mode.id} startIcon={mode.icon} color="info">
                                {mode.name}
                            </Button>
                        )
                    })
                }
            </div>
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