import React from 'react';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar as MUIToolbar, Typography, AppBar, Toolbar } from '@mui/material';

interface SidebarLayoutProps {
    children: React.ReactNode
    onStyleChange: (style: string) => void
}

const drawerWidth = 240;

export default function SidebarLayout(props: SidebarLayoutProps) {
    const handleStyleChange = (style: string) => {
        props.onStyleChange(style);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <MUIToolbar>
                    <Typography variant="h6" noWrap component="div">
                        React Map
                    </Typography>
                </MUIToolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleStyleChange('https://api.maptiler.com/maps/streets-v2/style.json?key=QOBZwJCNf0crlImWg4V6')}>
                                <ListItemText primary="Default (Street)" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleStyleChange('https://demotiles.maplibre.org/style.json')}>
                                <ListItemText primary="OSM" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleStyleChange('https://basemaps.cartocdn.com/gl/positron-gl-style/style.json')}>
                                <ListItemText primary="Aquarelle" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleStyleChange('https://api.maptiler.com/maps/satellite/style.json?key=QOBZwJCNf0crlImWg4V6')}>
                                <ListItemText primary="Satellite" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Box
                component="div"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                }}
            >
                <Toolbar />
                {props.children}
            </Box>
        </Box>
    );
}