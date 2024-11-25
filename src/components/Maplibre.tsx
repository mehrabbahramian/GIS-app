import React, { useEffect, useRef, useState } from "react";
import maplibregl from 'maplibre-gl';
import Swal from "sweetalert2";
import { Button, Stack } from "@mui/material";
import { CloudUpload, Delete, Download, Hexagon, PanoramaFishEye, PanTool, Rectangle, ShowChart } from "@mui/icons-material";
import {
    HexColor,
    TerraDraw,
    TerraDrawCircleMode,
    TerraDrawFreehandMode,
    TerraDrawLineStringMode,
    TerraDrawMapLibreGLAdapter,
    TerraDrawPolygonMode,
    TerraDrawRectangleMode
} from "terra-draw";
import Styles from "./Maplibre.module.css";

type colorsType = {
    fillColor: HexColor,
    fillOpacity: number,
    outlineColor: HexColor,
    outlineWidth: number
}

interface MapLibreProps {
    style: string;
    color?: colorsType;
    onDrawStyleChange: (e:any) => void;
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
    }
]

function Maplibre(props: MapLibreProps) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const drawRef = useRef<TerraDraw | null>();
    const [mouseCoordinates, setMouseCoordinates] = useState<string>("")

    useEffect(() => {
        if (!mapContainer.current) return;

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: props.style,
            center: [53.6880, 32.4279],
            zoom: 5,
        });

        mapRef.current = map;

        map.on("mousemove", (e) => {
            const { lng, lat } = e.lngLat;
            setMouseCoordinates(`lng: ${lng.toFixed(6)} | lat: ${lat.toFixed(6)}`)
        })

        const draw = new TerraDraw({
            adapter: new TerraDrawMapLibreGLAdapter({ map }),
            modes: [
                new TerraDrawFreehandMode({
                    styles: {
                        fillColor: "#ff0000",
                        fillOpacity: 0.5,
                        outlineColor: "#000000",
                        outlineWidth: 2,
                    }
                }),
                new TerraDrawPolygonMode({
                    styles: {
                        fillColor: "#ff0000",
                        fillOpacity: 0.5,
                        outlineColor: "#000000",
                        outlineWidth: 2,
                    }
                }),
                new TerraDrawRectangleMode({
                    styles: {
                        fillColor: "#ff0000",
                        fillOpacity: 0.5,
                        outlineColor: "#000000",
                        outlineWidth: 2,
                    }
                }),
                new TerraDrawCircleMode({
                    styles: {
                        fillColor: "#ff0000",
                        fillOpacity: 0.5,
                        outlineColor: "#000000",
                        outlineWidth: 2,
                    }
                }),
                new TerraDrawLineStringMode({
                    styles: {
                        lineStringColor: "#ff0000",
                        lineStringWidth: 2
                    }
                })
            ],
            idStrategy: {
                isValidId: (id) => typeof id === "number" && Number.isInteger(id),
                getId: (function () {
                    let id = 0;
                    return function () {
                        return ++id;
                    };
                })()
            },
        })

        draw.start();
        drawRef.current = draw;
        draw.setMode("freehand");
        return () => mapRef.current?.remove()
    }, [props.style])

    useEffect(() => {
        if (drawRef.current && props.onDrawStyleChange) {
            props.onDrawStyleChange((newStyles : any) => {
                console.log(newStyles)
            })
        }
    }, [props.onDrawStyleChange])

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

    const handleExportDrawing = () => {
        if (!drawRef.current) {
            Swal.fire({
                title: "No Drawing!",
                icon: "error"
            })
            return;
        }

        if (drawRef.current) {
            const features = drawRef.current.getSnapshot();
            const filteredFeatures = features.filter((feature) => !feature.properties.midpoint && !feature.properties.selectionPoint)
            const dataStr = JSON.stringify(filteredFeatures, null, 2);

            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = 'drawn-shape.geojson';
            link.click();

            URL.revokeObjectURL(url);

            Swal.fire({
                title: "Drawing exported!",
                icon: "success"
            })
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
            <div className={Styles.optionsBar}>
                {
                    controlModes.map((mode) => {
                        return (
                            <Button className={Styles.optionButtons} variant="contained" onClick={() => handleDrawModeChange(mode.mode)} key={mode.id} startIcon={mode.icon} color="info">
                                {mode.name}
                            </Button>
                        )
                    })
                }
                <Button
                    variant="contained"
                    onClick={() => {
                        if (drawRef.current) {
                            drawRef.current.clear()
                        }
                    }}
                    startIcon={<Delete />}
                    color="info">
                </Button>
            </div>
            <div style={{ padding: '10px', background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                <Stack
                    direction={"row"}
                    spacing={2}
                    justifyContent={'center'}
                >
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
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Download />}
                        onClick={handleExportDrawing}
                    >
                        Export GeoJson File
                    </Button>
                </Stack>
            </div>
            <div
                ref={mapContainer}
                style={{
                    flexGrow: 1,
                    height: '100vh',
                    width: '100vw',
                }}
            />
            <div className={Styles.coordinatesContainer}>
                {mouseCoordinates}
            </div>
        </div>
    );
}

export default Maplibre;