"use client";

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import List from "@mui/material/List";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";
import Drawer from "@mui/material/Drawer";
import Avatar from "@mui/material/Avatar";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import ListItem from "@mui/material/ListItem";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import PeopleIcon from "@mui/icons-material/People";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ListItemButton from "@mui/material/ListItemButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import BottomNavigation from "@mui/material/BottomNavigation";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { toggleTheme } from "@/store/themeSlice";
import { logout, reset } from "@/store/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import { alpha, useTheme } from "@mui/material/styles";

import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";

const DRAWER_WIDTH = 256;

const BASE_NAV_ITEMS = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
  { text: "Flats", icon: <ApartmentIcon />, path: "/admin/flats" },
  { text: "Tenants", icon: <PeopleIcon />, path: "/admin/tenants" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const muiTheme = useTheme();

  const { user } = useSelector((state: RootState) => state.auth);
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const isDark = themeMode === "dark";

  const PUBLIC_ROUTES = [
    "/",
    "/login",
    "/signup",
    "/verify-email",
    "/accept-invitation",
    "/forgot-password",
    "/reset-password",
  ];
  const isPublicRoute =
    pathname === "/" ||
    PUBLIC_ROUTES.filter((r) => r !== "/").some((route) =>
      pathname.startsWith(route),
    );

  // All hooks MUST be called before any early returns (Rules of Hooks)
  const NAV_ITEMS = React.useMemo(() => {
    const items = [...BASE_NAV_ITEMS];
    if (user && (user as any).role === "superadmin") {
      items.push({
        text: "Users",
        icon: <AdminPanelSettingsOutlinedIcon />,
        path: "/admin/users",
      });
    }
    return items;
  }, [user]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!user && !isPublicRoute) {
      router.push("/login");
    }

    if (user && (pathname === "/login" || pathname === "/signup")) {
      router.push("/admin/dashboard");
    }
  }, [user, pathname, router, isPublicRoute]);

  if (isPublicRoute) return <>{children}</>;
  if (!user) return null;
  if (!mounted) return null;

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    router.push("/login");
    setAnchorEl(null);
  };

  /* ── Sidebar content ── */
  const Sidebar = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo area */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: `1px solid ${muiTheme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${muiTheme.palette.primary.main}, ${muiTheme.palette.primary.dark})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ApartmentIcon sx={{ color: "#fff", fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.1}>
            Tenant Admin
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Property Manager
          </Typography>
        </Box>
      </Box>

      {/* Nav items */}
      <Box sx={{ px: 1.5, pt: 2, flex: 1 }}>
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{
            px: 1.5,
            mb: 0.5,
            display: "block",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Navigation
        </Typography>
        <List disablePadding>
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.path);
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={active}
                  onClick={() => {
                    router.push(item.path);
                    setMobileOpen(false);
                  }}
                  sx={{
                    borderRadius: 2.5,
                    py: 1.1,
                    px: 1.5,
                    "&.Mui-selected": {
                      bgcolor: alpha(
                        muiTheme.palette.primary.main,
                        isDark ? 0.18 : 0.1,
                      ),
                      color: muiTheme.palette.primary.main,
                      "& .MuiListItemIcon-root": {
                        color: muiTheme.palette.primary.main,
                      },
                      "&:hover": {
                        bgcolor: alpha(muiTheme.palette.primary.main, 0.15),
                      },
                    },
                    "&:hover": {
                      bgcolor: alpha(muiTheme.palette.primary.main, 0.06),
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 38,
                      color: active ? "inherit" : "text.secondary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: active ? 700 : 500,
                      fontSize: "0.9rem",
                    }}
                  />
                  {active && (
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Bottom: theme toggle + user */}
      <Box
        sx={{
          px: 1.5,
          pb: 2,
          borderTop: `1px solid ${muiTheme.palette.divider}`,
          pt: 2,
        }}
      >
        <ListItemButton
          onClick={() => dispatch(toggleTheme())}
          sx={{ borderRadius: 2.5, py: 1, px: 1.5, mb: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 38, color: "text.secondary" }}>
            {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
          </ListItemIcon>
          <ListItemText
            primary={isDark ? "Light Mode" : "Dark Mode"}
            primaryTypographyProps={{
              fontWeight: 500,
              fontSize: "0.875rem",
              color: "text.secondary",
            }}
          />
        </ListItemButton>

        {/* User card */}
        <Box
          sx={{
            mt: 0.5,
            px: 1.5,
            py: 1.5,
            borderRadius: 2.5,
            bgcolor: alpha(muiTheme.palette.primary.main, 0.06),
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "primary.main",
              fontSize: "0.85rem",
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </Avatar>
          <Box sx={{ overflow: "hidden" }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {user?.name || "Admin"}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email || ""}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  let bottomNavValue = 0;
  if (pathname.startsWith("/flats")) bottomNavValue = 1;
  if (pathname.startsWith("/tenants")) bottomNavValue = 2;

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* ── Top AppBar (mobile only branding + hamburger) ── */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: "background.paper",
          borderBottom: `1px solid ${muiTheme.palette.divider}`,
          color: "text.primary",
          backdropFilter: "blur(8px)",
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 2, sm: 3 } }}>
          <IconButton
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 1.5, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Mobile brand */}
          <Box
            sx={{
              display: { xs: "flex", sm: "none" },
              alignItems: "center",
              gap: 1,
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: 1.5,
                background: `linear-gradient(135deg, ${muiTheme.palette.primary.main}, ${muiTheme.palette.primary.dark})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ApartmentIcon sx={{ color: "#fff", fontSize: 16 }} />
            </Box>
            <Typography variant="subtitle1" fontWeight={700}>
              Tenant Admin
            </Typography>
          </Box>

          {/* Desktop: page breadcrumb or spacer */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {NAV_ITEMS.find((n) => pathname.startsWith(n.path))?.text || ""}
            </Typography>
          </Box>

          {/* Theme toggle on desktop */}
          <IconButton
            onClick={() => dispatch(toggleTheme())}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {/* Avatar / account menu */}
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ ml: 0.5 }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "primary.main",
                fontSize: "0.85rem",
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{ sx: { mt: 1, minWidth: 160, borderRadius: 2.5 } }}
          >
            <MenuItem disabled sx={{ opacity: 1 }}>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleLogout}
              sx={{ color: "error.main", fontWeight: 600 }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* ── Sidebar ── */}
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          }}
        >
          {Sidebar}
        </Drawer>
        {/* Desktop permanent drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              borderRight: `1px solid ${muiTheme.palette.divider}`,
              bgcolor: "background.paper",
            },
          }}
          open
        >
          {Sidebar}
        </Drawer>
      </Box>

      {/* ── Main Content ── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: "56px", sm: "64px" },
          pb: { xs: "64px", sm: 0 },
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          height: "100vh",
          overflowY: "auto",
          bgcolor: "background.default",
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: "auto" }}>
          {children}
        </Box>
      </Box>

      {/* ── Mobile Bottom Navigation ── */}
      <Paper
        elevation={8}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: { xs: "block", sm: "none" },
          zIndex: 1200,
          borderTop: `1px solid ${muiTheme.palette.divider}`,
          borderRadius: 0,
        }}
      >
          <BottomNavigation
            showLabels
            value={bottomNavValue}
            onChange={(_, v) => {
              if (v === 0) router.push("/admin/dashboard");
              if (v === 1) router.push("/admin/flats");
              if (v === 2) router.push("/admin/tenants");
            }}
            sx={{ bgcolor: "background.paper", height: 60 }}
          >
          <BottomNavigationAction label="Dashboard" icon={<DashboardIcon />} />
          <BottomNavigationAction label="Flats" icon={<ApartmentIcon />} />
          <BottomNavigationAction label="Tenants" icon={<PeopleIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
