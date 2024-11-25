import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { Menu, ChevronLeft, ChevronRight, Map, ExpandLess, ExpandMore, Layers, Brush } from "@mui/icons-material"
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useEffect, useState } from 'react';
import { Button, Checkbox, Collapse, TextField } from '@mui/material';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);

interface SidebarLayoutProps {
    children: React.ReactNode;
    onStyleChange: (style: string) => void;
    onToggleLayerVisibility: (layerId: string) => void;
    onDrawStyleChange: (e: any) => void
}

function SidebarLayout(props: SidebarLayoutProps) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [stylesDropdownOpen, setStylesDropdownOpen] = useState<boolean>(false);
    const [layersDropdownOpen, setLayersDropdownOpen] = useState<boolean>(false);
    const [drawStylesDropdownOpen, setDrawStylesDropdownOpen] = useState(false);
    const [geoJsonFiles, setGeoJsonFiles] = useState<{ id: string; name: string }[]>([]);
    const [drawStyles, setDrawStyles] = useState({
        fillColor: "#ff0000",
        fillOpacity: 0.5,
        outlineColor: "#000000",
        outlineWidth: 2,
    })

    useEffect(() => {
        const savedFiles = JSON.parse(localStorage.getItem("geojsonfiles") || "[]");
        setGeoJsonFiles(savedFiles.map((file: any) => ({ id: file.id, name: file.name })));
    }, []);

    const handleStyleChange = (style: string) => {
        props.onStyleChange(style);
    };

    const toggleLayerVisibility = (layerId: string) => {
        props.onToggleLayerVisibility(layerId);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
        setStylesDropdownOpen(false);
        setLayersDropdownOpen(false);
        setDrawStylesDropdownOpen(false)
    };

    const toggleStylesDropdown = () => {
        setStylesDropdownOpen((prev) => !prev);
        setOpen(true);
    };

    const toggleLayersDropdown = () => {
        setLayersDropdownOpen((prev) => !prev);
        setOpen(true);
    }

    const toggleDrawStylesDropdown = () => {
        setDrawStylesDropdownOpen(!drawStylesDropdownOpen);
        setOpen(true);
    }

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setDrawStyles({ ...drawStyles, [name]: value })
    }

    const applyStyles = () => {
        props.onDrawStyleChange(drawStyles)
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={[
                            {
                                marginRight: 5,
                            },
                            open && { display: 'none' },
                        ]}
                    >
                        <Menu />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItem key={"Styles"} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={[
                                {
                                    minHeight: 48,
                                    px: 2.5,
                                },
                                open ? { justifyContent: 'initial' } : { justifyContent: 'center', },
                            ]}
                            onClick={toggleStylesDropdown}
                        >
                            <ListItemIcon
                                sx={[
                                    {
                                        minWidth: 0,
                                        justifyContent: 'center',
                                    },
                                    open ? { mr: 3 } : { mr: 'auto' },
                                ]}
                            >
                                <Map />
                            </ListItemIcon>
                            <ListItemText
                                primary={"Styles"}
                                sx={[
                                    open ? { opacity: 1, } : { opacity: 0, },
                                ]}
                            />
                            {open ? (stylesDropdownOpen ? <ExpandLess /> : <ExpandMore />) : ""}
                        </ListItemButton>
                        <Collapse in={stylesDropdownOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton
                                    sx={{ pl: open ? 4 : 2.5 }}
                                    onClick={() => handleStyleChange('https://api.maptiler.com/maps/streets-v2/style.json?key=QOBZwJCNf0crlImWg4V6')}
                                >
                                    <ListItemText primary="Default (Streets)" />
                                </ListItemButton>
                                <ListItemButton
                                    sx={{ pl: open ? 4 : 2.5 }}
                                    onClick={() => handleStyleChange('https://demotiles.maplibre.org/style.json')}
                                >
                                    <ListItemText primary="OSM" />
                                </ListItemButton>
                                <ListItemButton
                                    sx={{ pl: open ? 4 : 2.5 }}
                                    onClick={() => handleStyleChange('https://basemaps.cartocdn.com/gl/positron-gl-style/style.json')}
                                >
                                    <ListItemText primary="Aquarelle" />
                                </ListItemButton>
                                <ListItemButton
                                    sx={{ pl: open ? 4 : 2.5 }}
                                    onClick={() => handleStyleChange('https://api.maptiler.com/maps/satellite/style.json?key=QOBZwJCNf0crlImWg4V6')}
                                >
                                    <ListItemText primary="Satellite" />
                                </ListItemButton>
                            </List>
                        </Collapse>
                    </ListItem>

                    <ListItem key={"Layers"} disablePadding sx={{ display: "block" }}>
                        <ListItemButton
                            sx={[
                                { minHeight: 48, px: 2.5 },
                                open ? { justifyContent: "initial" } : { justifyContent: "center" },
                            ]}
                            onClick={toggleLayersDropdown}
                        >
                            <ListItemIcon
                                sx={[
                                    { minWidth: 0, justifyContent: "center" },
                                    open ? { mr: 3 } : { mr: "auto" },
                                ]}
                            >
                                <Layers />
                            </ListItemIcon>
                            <ListItemText
                                primary={"Layers"}
                                sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                            />
                            {open ? (layersDropdownOpen ? <ExpandLess /> : <ExpandMore />) : ""}
                        </ListItemButton>
                        <Collapse in={layersDropdownOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {geoJsonFiles.length > 0 ? (
                                    geoJsonFiles.map((file) => (
                                        <ListItem key={file.id} disablePadding>
                                            <ListItemButton sx={{ pl: open ? 4 : 2.5 }}>
                                                <Checkbox
                                                    onChange={() => toggleLayerVisibility(file.id)}
                                                />
                                                <ListItemText primary={file.name} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))
                                ) : (
                                    <ListItem>
                                        <ListItemText primary="No GeoJSON layers" />
                                    </ListItem>
                                )}
                            </List>
                        </Collapse>
                    </ListItem>
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton onClick={toggleDrawStylesDropdown}>
                            <ListItemIcon>
                                <Brush />
                            </ListItemIcon>
                            <ListItemText primary={"Styles"} />
                            {drawStylesDropdownOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={drawStylesDropdownOpen} timeout="auto" unmountOnExit >
                        <Box sx={{ display: "flex", flexDirection: "column", padding: 2 }}>
                            <TextField
                                label="Fill Color"
                                name="fillColor"
                                value={drawStyles.fillColor}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Fill Opacity"
                                name="fillOpacity"
                                value={drawStyles.fillOpacity}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Outline Color"
                                name="outlineColor"
                                value={drawStyles.outlineColor}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Outline Width"
                                name="outlineWidth"
                                value={drawStyles.outlineWidth}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <Button variant="contained" onClick={applyStyles} fullWidth>
                                Apply Styles
                            </Button>
                        </Box>
                    </Collapse>
                </List>
                <Divider />
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1 }}>
                <DrawerHeader />
                {props.children}
            </Box>
        </Box>
    );
}

export default SidebarLayout;