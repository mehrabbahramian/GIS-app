import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { Menu, ChevronLeft, ChevronRight, Map, ExpandLess, ExpandMore } from "@mui/icons-material"
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';
import { Collapse } from '@mui/material';

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
}

function SidebarLayout(props: SidebarLayoutProps) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    const handleStyleChange = (style: string) => {
        props.onStyleChange(style);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
        setDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev)
    };

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
                                open
                                    ? { justifyContent: 'initial' }
                                    : { justifyContent: 'center', },
                            ]}
                            onClick={toggleDropdown}
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
                                    open
                                        ? {
                                            opacity: 1,
                                        }
                                        : {
                                            opacity: 0,
                                        },
                                ]}
                            />
                            {open ? (dropdownOpen ? <ExpandLess /> : <ExpandMore />) : ""}
                        </ListItemButton>
                        <Collapse in={dropdownOpen} timeout="auto" unmountOnExit>
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