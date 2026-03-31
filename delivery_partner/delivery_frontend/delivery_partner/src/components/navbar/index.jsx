import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Transition,
} from "@headlessui/react";
import Drawer from "@mui/material/Drawer";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import { useNavigate } from "react-router-dom";

const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Live Orders", href: "/live-orders" },
    { name: "History", href: "/history" },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
    const [state, setState] = useState({ left: false });
    const navigate = useNavigate();

    const toggleDrawer = (open) => () => {
        setState({ left: open });
    };

    const handleLogout = () => {
        localStorage.removeItem("deliveryToken");
        localStorage.removeItem("deliveryId");
        navigate("/");
    };

    const mainNavItems = [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
        { text: "Live Orders", icon: <LocalShippingIcon />, path: "/live-orders" },
        { text: "Delivery History", icon: <HistoryIcon />, path: "/history" },
    ];

    const list = () => (
        <Box
            sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            {/* DRAWER HEADER */}
            <div className="p-8 bg-black text-white mb-4">
                <h2 className="text-2xl font-black tracking-tighter italic">flowerKart</h2>
                <p className="text-[10px] font-bold opacity-60 uppercase tracking-[0.2em] mt-1">Delivery Partner</p>
            </div>

            <div className="flex-1 overflow-y-auto">
                <List>
                    <p className="px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 mt-4">Navigation</p>
                    {mainNavItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton onClick={() => navigate(item.path)} sx={{ px: 3, py: 1.5 }}>
                                <ListItemIcon sx={{ minWidth: 40, color: '#374151' }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '14px', fontWeight: 600, color: '#374151' }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{ p: 2, borderRadius: '16px', bgcolor: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.12)' } }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><LogoutIcon /></ListItemIcon>
                        <ListItemText primary="Sign Out" primaryTypographyProps={{ fontSize: '14px', fontWeight: 800 }} />
                    </ListItemButton>
                </ListItem>
            </div>
        </Box>
    );

    return (
        <>
            <Drawer
                anchor="left"
                open={state.left}
                onClose={toggleDrawer(false)}
                PaperProps={{ sx: { borderTopRightRadius: '32px', borderBottomRightRadius: '32px', overflow: 'hidden' } }}
            >
                {list()}
            </Drawer>

            <Disclosure as="nav" className="bg-white border-b border-gray-200">
                <div className="w-full px-4">
                    <div className="relative flex h-16 items-center justify-between">

                        {/* MOBILE MENU BUTTON */}
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100">
                                <Bars3Icon className="block h-6 w-6 data-open:hidden" />
                                <XMarkIcon className="hidden h-6 w-6 data-open:block" />
                            </DisclosureButton>
                        </div>

                        {/* LOGO + LINKS */}
                        <div className="flex flex-1 items-center justify-center sm:justify-start">
                            <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
                                <button onClick={toggleDrawer(true)} className="rounded-md p-2 hover:bg-gray-100">
                                    ☰
                                </button>
                                <DeliveryDiningIcon className="text-red-500" />
                                <span>flowerKart <span className="text-red-500 font-black">Delivery</span></span>
                            </div>

                            {/* DESKTOP LINKS */}
                            <div className="hidden sm:ml-8 sm:flex space-x-1">
                                {navigation.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => navigate(item.href)}
                                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="flex items-center gap-3">
                            <button className="rounded-md p-2 text-gray-700 hover:bg-gray-100">
                                <BellIcon className="h-6 w-6" />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="hidden sm:flex items-center gap-1 rounded-xl bg-red-50 px-3 py-1.5 text-sm font-bold text-red-600 hover:bg-red-100 transition"
                            >
                                <LogoutIcon style={{ fontSize: 16 }} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* MOBILE PANEL */}
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 -translate-y-2"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 -translate-y-2"
                >
                    <DisclosurePanel className="sm:hidden border-t border-gray-200">
                        <div className="px-2 pb-3 pt-2 space-y-1">
                            {navigation.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => navigate(item.href)}
                                    className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </DisclosurePanel>
                </Transition>
            </Disclosure>
        </>
    );
}
