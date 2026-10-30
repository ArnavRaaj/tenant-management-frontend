"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { toggleTheme } from "@/store/themeSlice";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Chip,
  AppBar,
  Toolbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Avatar,
  Rating,
  IconButton,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SpeedIcon from "@mui/icons-material/Speed";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const isDark = themeMode === "dark";

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { value: "0 Apps", label: "Required for Tenants", sub: "100% WhatsApp & mobile web" },
    { value: "< 60s", label: "Aadhaar e-KYC Flow", sub: "Official DigiLocker / UIDAI OTP" },
    { value: "Multi-Mode", label: "Rent & WhatsApp Slips", sub: "Cash, Direct UPI & Receipts" },
    { value: "100%", label: "Data Isolation Vault", sub: "Multi-tenant AES-256 encryption" },
  ];

  const features = [
    {
      icon: <ApartmentIcon sx={{ fontSize: 32, color: "accent.cyan" }} />,
      tag: "INVENTORY",
      title: "Building & Flat Matrix",
      description:
        "Manage unlimited buildings, blocks, and floor layouts with instant visual badges for occupied, vacant, and notice-period flats.",
    },
    {
      icon: <PeopleAltOutlinedIcon sx={{ fontSize: 32, color: "accent.emerald" }} />,
      tag: "COMPLIANCE",
      title: "Tenant Records & Aadhaar KYC",
      description:
        "Store complete tenant profiles, emergency contacts, occupant headcounts, security deposit ledgers, and encrypted Aadhaar cards.",
    },
    {
      icon: <MonetizationOnOutlinedIcon sx={{ fontSize: 32, color: "accent.amber" }} />,
      tag: "CASH FLOW",
      title: "Real-Time Rent Ledgers",
      description:
        "Track pending dues, log offline and online payments, generate receipt histories, and visualize revenue across months and floors.",
    },
    {
      icon: <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 32, color: "accent.purple" }} />,
      tag: "GOVERNANCE",
      title: "Delegated Property Admins",
      description:
        "Superadmins can invite property managers per complex with email-verified credentials and strictly scoped organization isolation.",
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 32, color: "accent.pink" }} />,
      tag: "SPEED",
      title: "Instant Vacancy Turnaround",
      description:
        "One-click tenant checkout, automated security deposit adjustments, and immediate relisting of vacant inventory.",
    },
    {
      icon: <ShieldOutlinedIcon sx={{ fontSize: 32, color: "accent.indigo" }} />,
      tag: "SECURITY",
      title: "Multi-Layer Email OTP Guard",
      description:
        "State-of-the-art authentication with rate-limited email OTP verification for signup, password recovery, and staff invitations.",
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Configure Properties & Flats",
      desc: "Add your buildings, configure floor numbering, assign physical addresses, and define baseline rental expectations.",
    },
    {
      step: "02",
      title: "Onboard Tenants & Verify KYC",
      desc: "Assign incoming tenants to vacant flats, record initial security deposit and rent terms, and archive identity documents.",
    },
    {
      step: "03",
      title: "Track Collections & Delegate",
      desc: "Monitor live collection metrics, follow up on pending balances, and invite on-site managers to handle daily inquiries.",
    },
  ];

  const plans = [
    {
      name: "Starter Landlord",
      badge: "FREE FOREVER",
      price: "₹0",
      period: "per month",
      desc: "Ideal for individual landlords managing up to 10 rental units.",
      features: [
        "Up to 10 Flats & Units",
        "Tenant Aadhaar KYC Storage",
        "Monthly Rent Collection Logs",
        "Email OTP Authentication",
        "Community Support",
      ],
      popular: false,
    },
    {
      name: "Property Manager",
      badge: "MOST POPULAR",
      price: "₹1,499",
      period: "per month",
      desc: "For growing property managers and apartment associations.",
      features: [
        "Unlimited Flats & Buildings",
        "Multi-Admin Delegation (Up to 5 Admins)",
        "Advanced Revenue & Floor Breakdown Analytics",
        "Automated Rent Balance Tracking",
        "Document Encryption & Document Vault",
        "Priority Support",
      ],
      popular: true,
    },
    {
      name: "Enterprise Real Estate",
      badge: "LARGE PORTFOLIOS",
      price: "₹4,999",
      period: "per month",
      desc: "Tailored for real estate investment groups and commercial towers.",
      features: [
        "Unlimited Units & Complexes",
        "Unlimited Property Admins",
        "Audit Log Trail & Compliance Export",
        "Dedicated Account Specialist",
        "Custom Feature Integrations & SLAs",
      ],
      popular: false,
    },
  ];

  const faqs = [
    {
      q: "Can I manage multiple buildings under one account?",
      a: "Yes. Nivaasa lets you register as many building complexes, towers, and standalone homes as you need under your single Superadmin account.",
    },
    {
      q: "How does the delegated Admin system work?",
      a: "As a Superadmin, you can invite property managers or co-owners from the Users tab. They receive an email invitation to create their password and can only access the data within your organization.",
    },
    {
      q: "Is tenant Aadhaar and KYC data securely encrypted?",
      a: "Yes. All sensitive tenant identification documents and Aadhaar numbers are protected using AES-256 encryption before storage in our cloud database.",
    },
    {
      q: "How does the email OTP verification operate?",
      a: "Whenever a new user registers or requests a password reset, our email service delivers an authenticated 6-digit OTP code with a 15-minute expiration window to protect account integrity.",
    },
  ];

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Live Demo", href: "#demo" },
    { label: "Workflow", href: "#workflow" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQs", href: "#faqs" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        position: "relative",
        transition: "background-color 0.25s ease, color 0.25s ease",
      }}
    >
      {/* ── Background Glow Effects ── */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: "360px", sm: "700px", md: "1100px" },
          height: { xs: "300px", md: "520px" },
          background: isDark
            ? "radial-gradient(circle, rgba(26,86,232,0.2) 0%, rgba(139,92,246,0.12) 40%, rgba(7,11,20,0) 70%)"
            : "radial-gradient(circle, rgba(59,130,246,0.14) 0%, rgba(147,197,253,0.1) 40%, rgba(248,250,252,0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Top Header Navigation ── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: alpha(theme.palette.background.default, 0.85),
          backdropFilter: "blur(16px)",
          borderBottom: 1,
          borderColor: "divider",
          zIndex: 1100,
          transition: "background-color 0.25s ease, border-color 0.25s ease",
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
          <Toolbar disableGutters sx={{ justifyContent: "space-between", py: { xs: 1, sm: 1.5 }, gap: 1 }}>
            {/* Brand Logo */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                cursor: "pointer",
                flexShrink: 0,
              }}
              onClick={() => router.push("/")}
            >
              <Box
                sx={{
                  width: { xs: 36, sm: 42 },
                  height: { xs: 36, sm: 42 },
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #1a56e8, #3b82f6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 20px rgba(26,86,232,0.45)",
                  flexShrink: 0,
                }}
              >
                <ApartmentIcon sx={{ color: "primary.contrastText", fontSize: { xs: 20, sm: 24 } }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={800}
                  sx={{
                    background: isDark
                      ? "linear-gradient(135deg, #ffffff, #94a3b8)"
                      : "linear-gradient(135deg, #0f172a, #334155)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.5px",
                    lineHeight: 1.1,
                    fontSize: { xs: "1.1rem", sm: "1.25rem" },
                  }}
                >
                  Nivaasa
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.68rem",
                    display: { xs: "none", sm: "block" },
                    whiteSpace: "nowrap",
                  }}
                >
                  निवास • Harmonious Property OS
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation Links (Visible on desktop >= lg) */}
            <Box
              sx={{
                display: { xs: "none", lg: "flex" },
                alignItems: "center",
                gap: { lg: 1.5, xl: 3 },
                mx: { lg: 1, xl: 2 },
              }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="text"
                  href={link.href}
                  sx={{
                    color: "text.secondary",
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: { lg: "0.875rem", xl: "0.925rem" },
                    px: { lg: 1.25, xl: 1.75 },
                    py: 0.6,
                    borderRadius: "8px",
                    whiteSpace: "nowrap",
                    "&:hover": { color: "primary.main", bgcolor: "action.hover" },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>

            {/* Actions: Theme Toggle + Auth + Hamburger Menu */}
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, flexShrink: 0 }}>
              {/* Theme Toggle Button */}
              <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                <IconButton
                  onClick={() => dispatch(toggleTheme())}
                  aria-label="Toggle theme mode"
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "10px",
                    bgcolor: "action.hover",
                    border: 1,
                    borderColor: "divider",
                    color: isDark ? "warning.main" : "text.primary",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "action.selected",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {isDark ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
                </IconButton>
              </Tooltip>

              {/* Desktop & Tablet Auth Buttons */}
              <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}>
                {mounted && user ? (
                  <Button
                    variant="contained"
                    id="nav-dashboard-btn"
                    onClick={() => router.push("/admin/dashboard")}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      borderRadius: "10px",
                      px: { sm: 2, md: 2.5 },
                      py: 0.85,
                      fontWeight: 600,
                      textTransform: "none",
                      background: "linear-gradient(135deg, #1a56e8, #3575f0)",
                      boxShadow: "0 4px 16px rgba(26,86,232,0.4)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="text"
                      id="nav-login-btn"
                      onClick={() => router.push("/login")}
                      sx={{
                        color: "text.primary",
                        fontWeight: 600,
                        textTransform: "none",
                        px: { sm: 1.5, md: 2 },
                        whiteSpace: "nowrap",
                        "&:hover": {
                          color: "text.primary",
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="contained"
                      id="nav-signup-btn"
                      onClick={() => router.push("/signup")}
                      sx={{
                        borderRadius: "10px",
                        px: { sm: 2, md: 2.5 },
                        py: 0.85,
                        fontWeight: 600,
                        textTransform: "none",
                        background: "linear-gradient(135deg, #1a56e8, #3575f0)",
                        boxShadow: "0 4px 16px rgba(26,86,232,0.4)",
                        whiteSpace: "nowrap",
                        "&:hover": {
                          background: "linear-gradient(135deg, #1441d4, #1a56e8)",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      Get Started Free
                    </Button>
                  </>
                )}
              </Box>

              {/* Mobile & Tablet Hamburger Menu Toggle (visible < lg) */}
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={{
                  display: { xs: "flex", lg: "none" },
                  color: "text.primary",
                  p: 0.85,
                  borderRadius: "10px",
                  border: 1,
                  borderColor: "divider",
                  bgcolor: "action.hover",
                  "&:hover": {
                    bgcolor: "action.selected",
                  },
                }}
                aria-label="Open mobile menu"
              >
                <MenuIcon fontSize="small" />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* ── Mobile Navigation Drawer ── */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: "80%",
            maxWidth: 320,
            bgcolor: "background.paper",
            color: "text.primary",
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ApartmentIcon sx={{ color: "primary.main" }} />
              <Typography variant="h6" fontWeight={800}>
                Nivaasa
              </Typography>
            </Box>
            <IconButton onClick={() => setMobileMenuOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ pt: 1 }}>
            {navLinks.map((item) => (
              <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component="a"
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{
                    borderRadius: "10px",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: 600,
                      color: "text.primary",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, pt: 2, borderTop: 1, borderColor: "divider" }}>
          {mounted && user ? (
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                setMobileMenuOpen(false);
                router.push("/admin/dashboard");
              }}
              sx={{
                py: 1.2,
                borderRadius: "10px",
                fontWeight: 700,
                background: "linear-gradient(135deg, #1a56e8, #3575f0)",
              }}
            >
              Open Dashboard
            </Button>
          ) : (
            <>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/login");
                }}
                sx={{
                  py: 1.2,
                  borderRadius: "10px",
                  fontWeight: 600,
                  borderColor: "divider",
                  color: "text.primary",
                }}
              >
                Sign In
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/signup");
                }}
                sx={{
                  py: 1.2,
                  borderRadius: "10px",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #1a56e8, #3575f0)",
                }}
              >
                Get Started Free
              </Button>
            </>
          )}
        </Box>
      </Drawer>

      {/* ── Hero Section ── */}
      <Box
        sx={{
          pt: { xs: 6, sm: 8, md: 12 },
          pb: { xs: 6, sm: 8, md: 11 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center", px: { xs: 2.5, sm: 3 } }}>
          <Chip
            icon={<SecurityOutlinedIcon sx={{ fontSize: "16px !important", color: "primary.main !important" }} />}
            label="निवास • Peaceful Living & Frictionless Property Operating System"
            size="small"
            sx={{
              mb: 3,
              px: 1.75,
              py: 2.2,
              bgcolor: "action.hover",
              color: "primary.main",
              border: 1,
              borderColor: "divider",
              fontWeight: 600,
              fontSize: { xs: "0.78rem", sm: "0.85rem" },
              backdropFilter: "blur(8px)",
            }}
          />

          <Typography
            component="h1"
            variant="h2"
            fontWeight={900}
            sx={{
              fontSize: { xs: "2.1rem", sm: "3.2rem", md: "4.2rem" },
              lineHeight: { xs: 1.15, sm: 1.1 },
              letterSpacing: { xs: "-1px", sm: "-2px" },
              mb: 3,
              color: "text.primary",
            }}
          >
            Harmonious Living.{" "}
            <Box
              component="span"
              sx={{
                background: isDark
                  ? "linear-gradient(135deg, #60a5fa 0%, #38bdf8 50%, #c084fc 100%)"
                  : "linear-gradient(135deg, #1d4ed8 0%, #0284c7 50%, #7c3aed 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Frictionless Property Management.
            </Box>
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              fontWeight: 400,
              maxWidth: 760,
              mx: "auto",
              mb: 5,
              lineHeight: 1.65,
              fontSize: { xs: "0.95rem", sm: "1.15rem" },
            }}
          >
            Rooted in the Indian wisdom of peaceful shelter (सुखवास). Bother your tenants as less as possible:
            1-click WhatsApp onboarding, official DigiLocker Aadhaar e-KYC, multi-mode rent collection with instant
            WhatsApp slips, and AI maintenance tracking with zero app installs.
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="large"
              id="hero-primary-signup-btn"
              onClick={() => router.push(mounted && user ? "/admin/dashboard" : "/signup")}
              endIcon={<ArrowForwardIcon />}
              sx={{
                height: 52,
                px: { xs: 3.5, sm: 4 },
                borderRadius: "12px",
                fontSize: { xs: "0.95rem", sm: "1.05rem" },
                fontWeight: 700,
                textTransform: "none",
                background: "linear-gradient(135deg, #1a56e8, #3575f0)",
                boxShadow: "0 8px 25px rgba(26,86,232,0.45)",
                transition: "all 0.2s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #1441d4, #1a56e8)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 30px rgba(26,86,232,0.55)",
                },
              }}
            >
              {mounted && user ? "Access Dashboard" : "Register as Superadmin"}
            </Button>

            <Button
              variant="outlined"
              size="large"
              id="hero-secondary-login-btn"
              onClick={() => router.push(mounted && user ? "/admin/dashboard" : "/login")}
              sx={{
                height: 52,
                px: { xs: 3, sm: 3.5 },
                borderRadius: "12px",
                fontSize: { xs: "0.95rem", sm: "1.05rem" },
                fontWeight: 600,
                textTransform: "none",
                color: "text.primary",
                borderColor: "divider",
                bgcolor: "background.paper",
                backdropFilter: "blur(8px)",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "action.hover",
                },
              }}
            >
              {mounted && user ? "My Account" : "Sign In to Portal"}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── Business ROI Metrics Bar ── */}
      <Container maxWidth="lg" sx={{ mb: 10, position: "relative", zIndex: 1, px: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3, md: 4 },
            borderRadius: "20px",
            background: isDark
              ? "linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)"
              : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
            backdropFilter: "blur(16px)",
            border: 1,
            borderColor: "divider",
            boxShadow: isDark ? "0 20px 40px rgba(0,0,0,0.4)" : "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
              gap: { xs: 2, md: 3 },
              textAlign: "center",
            }}
          >
            {stats.map((s, idx) => (
              <Box key={idx} sx={{ px: { xs: 0.5, sm: 1 } }}>
                <Typography
                  variant="h3"
                  fontWeight={900}
                  sx={{
                    background: isDark
                      ? "linear-gradient(135deg, #60a5fa, #38bdf8)"
                      : "linear-gradient(135deg, #1d4ed8, #0284c7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 0.5,
                    fontSize: { xs: "1.75rem", sm: "2.3rem", md: "2.8rem" },
                  }}
                >
                  {s.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.primary", fontWeight: 700 }}
                >
                  {s.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", display: "block" }}
                >
                  {s.sub}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Container>

      {/* ── Interactive Live Demo & Mockup Preview ── */}
      <Box
        id="demo"
        sx={{
          py: { xs: 7, md: 10 },
          bgcolor: "background.default",
          borderTop: 1,
          borderBottom: 1,
          borderColor: "divider",
          position: "relative",
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Chip
              label="PRODUCT EXPERIENCE"
              size="small"
              sx={{
                color: "accent.cyan",
                bgcolor: "action.hover",
                fontWeight: 700,
                mb: 1.5,
              }}
            />
            <Typography
              variant="h4"
              fontWeight={800}
              gutterBottom
              sx={{ color: "text.primary", fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
            >
              See Nivaasa in Action
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", maxWidth: 600, mx: "auto" }}
            >
              Explore how property managers monitor flat occupancy, verify tenant records,
              and review revenue streams in real time.
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
                  p: 0.6,
                  borderRadius: "14px",
                  border: 1,
                  borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
                  "& .MuiTabs-indicator": { display: "none" },
                  maxWidth: "100%",
                }}
              >
                <Tab
                  label="🏢 Flat Matrix & Status"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "10px",
                    minHeight: 42,
                    px: { xs: 2, sm: 3 },
                    fontSize: { xs: "0.85rem", sm: "0.92rem" },
                    color: isDark ? "rgba(255, 255, 255, 0.75)" : "#374151",
                    bgcolor: activeTab === 0 ? "primary.main" : "transparent",
                    "&.Mui-selected": {
                      color: "#ffffff !important",
                      bgcolor: "primary.main",
                      boxShadow: isDark
                        ? "0 4px 14px rgba(26, 86, 232, 0.45)"
                        : "0 4px 14px rgba(26, 86, 232, 0.25)",
                    },
                    "&:hover": {
                      color: isDark ? "#ffffff" : "#111827",
                      bgcolor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                />
                <Tab
                  label="👤 Tenant Aadhaar KYC"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "10px",
                    minHeight: 42,
                    px: { xs: 2, sm: 3 },
                    fontSize: { xs: "0.85rem", sm: "0.92rem" },
                    color: isDark ? "rgba(255, 255, 255, 0.75)" : "#374151",
                    bgcolor: activeTab === 1 ? "primary.main" : "transparent",
                    "&.Mui-selected": {
                      color: "#ffffff !important",
                      bgcolor: "primary.main",
                      boxShadow: isDark
                        ? "0 4px 14px rgba(26, 86, 232, 0.45)"
                        : "0 4px 14px rgba(26, 86, 232, 0.25)",
                    },
                    "&:hover": {
                      color: isDark ? "#ffffff" : "#111827",
                      bgcolor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                />
                <Tab
                  label="📊 Cash Flow & Rent"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "10px",
                    minHeight: 42,
                    px: { xs: 2, sm: 3 },
                    fontSize: { xs: "0.85rem", sm: "0.92rem" },
                    color: isDark ? "rgba(255, 255, 255, 0.75)" : "#374151",
                    bgcolor: activeTab === 2 ? "primary.main" : "transparent",
                    "&.Mui-selected": {
                      color: "#ffffff !important",
                      bgcolor: "primary.main",
                      boxShadow: isDark
                        ? "0 4px 14px rgba(26, 86, 232, 0.45)"
                        : "0 4px 14px rgba(26, 86, 232, 0.25)",
                    },
                    "&:hover": {
                      color: isDark ? "#ffffff" : "#111827",
                      bgcolor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                />
              </Tabs>
            </Box>
          </Box>

          {/* Interactive Screen Preview Container */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: "24px",
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
              boxShadow: isDark ? "0 25px 60px rgba(0, 0, 0, 0.6)" : "0 20px 45px rgba(0, 0, 0, 0.08)",
            }}
          >
            {/* Top Browser Bar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 3,
                pb: 2,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "accent.red" }} />
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "accent.amber" }} />
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "accent.emerald" }} />
              <Typography variant="caption" sx={{ color: "text.secondary", ml: 2 }}>
                nivaasa.in/admin/{activeTab === 0 ? "flats" : activeTab === 1 ? "tenants" : "dashboard"}
              </Typography>
            </Box>

            {/* TAB 0: FLATS PREVIEW */}
            {activeTab === 0 && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{ color: "text.primary" }}
                    >
                      Building: Grand Horizon Heights (Tower A)
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      12 Flats Configured • 9 Occupied • 3 Vacant
                    </Typography>
                  </Box>
                  <Chip label="Floor 2 Layout" color="primary" size="small" />
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                    gap: 2.5,
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: "14px",
                      bgcolor: "action.hover",
                      border: 1,
                      borderColor: "success.main",
                      boxShadow: isDark
                        ? "0 4px 15px rgba(16, 185, 129, 0.15)"
                        : "0 2px 10px rgba(16, 185, 129, 0.1)",
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight={700} sx={{ color: "text.primary" }}>
                        Flat 201
                      </Typography>
                      <Chip label="Occupied" size="small" color="success" sx={{ height: 20, fontSize: "0.7rem" }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: "text.primary" }}>
                      Tenant: Vikram Malhotra
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                      Rent: ₹24,000/mo • Balance: ₹0
                    </Typography>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: "14px",
                      bgcolor: "action.hover",
                      border: 1,
                      borderColor: "warning.main",
                      borderStyle: "dashed",
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight={700} sx={{ color: "text.primary" }}>
                        Flat 202
                      </Typography>
                      <Chip label="Vacant" size="small" color="warning" sx={{ height: 20, fontSize: "0.7rem" }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Ready for Tenant Assignment
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                      Target Rent: ₹22,000/mo
                    </Typography>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: "14px",
                      bgcolor: "action.hover",
                      border: 1,
                      borderColor: "success.main",
                      boxShadow: isDark
                        ? "0 4px 15px rgba(16, 185, 129, 0.15)"
                        : "0 2px 10px rgba(16, 185, 129, 0.1)",
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight={700} sx={{ color: "text.primary" }}>
                        Flat 203
                      </Typography>
                      <Chip label="Occupied" size="small" color="success" sx={{ height: 20, fontSize: "0.7rem" }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: "text.primary" }}>
                      Tenant: Ananya Roy
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                      Rent: ₹26,500/mo • Balance: ₹0
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            )}

            {/* TAB 1: TENANT KYC PREVIEW */}
            {activeTab === 1 && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ color: "text.primary" }}
                  >
                    Active Tenant Verification & KYC Ledgers
                  </Typography>
                  <Chip
                    icon={<FactCheckOutlinedIcon sx={{ fontSize: "16px !important", color: "success.main !important" }} />}
                    label="Aadhaar Encrypted"
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: "action.hover",
                      border: 1,
                      borderColor: "divider",
                      borderRadius: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "primary.main" }}>VM</Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ color: "text.primary" }}>
                          Vikram Malhotra
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          Flat 201 • Contact: +91 98765 43210 • 3 Occupants
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: "right", display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label="Deposit: ₹50,000"
                        size="small"
                        sx={{
                          bgcolor: "action.hover",
                          color: "text.primary",
                        }}
                      />
                      <Chip label="KYC Verified" color="success" size="small" />
                    </Box>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: "action.hover",
                      border: 1,
                      borderColor: "divider",
                      borderRadius: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "secondary.main" }}>AR</Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ color: "text.primary" }}>
                          Ananya Roy
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          Flat 203 • Contact: +91 98220 11223 • 2 Occupants
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: "right", display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label="Deposit: ₹55,000"
                        size="small"
                        sx={{
                          bgcolor: "action.hover",
                          color: "text.primary",
                        }}
                      />
                      <Chip label="KYC Verified" color="success" size="small" />
                    </Box>
                  </Paper>
                </Box>
              </Box>
            )}

            {/* TAB 2: FINANCIALS PREVIEW */}
            {activeTab === 2 && (
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "text.primary" }}>
                    Monthly Collection Breakdown & Floor Yield
                  </Typography>
                  <Typography variant="caption" color="success.main" fontWeight={700}>
                    +18% YOY Growth
                  </Typography>
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      bgcolor: "action.hover",
                      border: 1,
                      borderColor: "divider",
                      borderRadius: "14px",
                    }}
                  >
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                      TOTAL RENT PROCESSED
                    </Typography>
                    <Typography variant="h4" fontWeight={800} color="accent.cyan" sx={{ my: 1 }}>
                      ₹2,24,500
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      98.5% collected on or before the 5th
                    </Typography>
                  </Paper>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      bgcolor: "action.hover",
                      border: 1,
                      borderColor: "divider",
                      borderRadius: "14px",
                    }}
                  >
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                      FLOOR PERFORMANCE
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.primary", mt: 1 }}>
                      First Floor: ₹72,500 (3 Flats)
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.primary", mt: 0.5 }}>
                      Second Floor: ₹78,000 (3 Flats)
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.primary", mt: 0.5 }}>
                      Ground Floor: ₹74,000 (3 Flats)
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>

      {/* ── Business Value Pillars (Grid of 6) ── */}
      <Box id="features" sx={{ py: { xs: 7, md: 11 }, position: "relative" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <Chip
              label="ENTERPRISE CAPABILITIES"
              size="small"
              sx={{
                color: "accent.indigo",
                bgcolor: "action.hover",
                fontWeight: 700,
                mb: 1.5,
              }}
            />
            <Typography
              variant="h4"
              fontWeight={900}
              gutterBottom
              sx={{ color: "text.primary", fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
            >
              Engineered for Serious Property Owners
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", maxWidth: 650, mx: "auto" }}
            >
              Everything required to scale from a single residential property to
              hundreds of commercial and multi-family residential units.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
              gap: 3.5,
            }}
          >
            {features.map((item, idx) => (
              <Paper
                key={idx}
                elevation={0}
                sx={{
                  p: 3.5,
                  borderRadius: "18px",
                  bgcolor: "background.paper",
                  border: 1,
                  borderColor: "divider",
                  boxShadow: isDark ? "none" : "0 4px 20px rgba(0,0,0,0.04)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: "primary.main",
                    boxShadow: isDark
                      ? "0 16px 36px rgba(0, 0, 0, 0.5)"
                      : "0 16px 36px rgba(0, 0, 0, 0.08)",
                  },
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: "12px",
                      bgcolor: "action.hover",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Chip
                    label={item.tag}
                    size="small"
                    sx={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      bgcolor: "action.hover",
                      color: "text.secondary",
                    }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: "text.primary" }}
                  gutterBottom
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.65 }}
                >
                  {item.description}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── 3-Step Workflow Section ── */}
      <Box
        id="workflow"
        sx={{
          py: { xs: 7, md: 10 },
          bgcolor: "background.default",
          borderTop: 1,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <Typography variant="overline" sx={{ color: "accent.cyan", fontWeight: 700 }}>
              HOW IT WORKS
            </Typography>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ color: "text.primary", mt: 0.5, fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
            >
              From Property Setup to Automated Cash Flow
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
              gap: 4,
            }}
          >
            {workflowSteps.map((ws, idx) => (
              <Box
                key={idx}
                sx={{
                  position: "relative",
                  p: 3.5,
                  borderRadius: "16px",
                  bgcolor: "background.paper",
                  border: 1,
                  borderColor: "divider",
                  boxShadow: isDark ? "none" : "0 4px 16px rgba(0,0,0,0.03)",
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={900}
                  sx={{
                    color: "action.disabled",
                    fontFamily: "monospace",
                    mb: 1.5,
                  }}
                >
                  {ws.step}
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: "text.primary" }}
                  gutterBottom
                >
                  {ws.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
                  {ws.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Pricing Tiers ── */}
      <Box id="pricing" sx={{ py: { xs: 7, md: 11 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <Chip
              label="TRANSPARENT VALUE"
              size="small"
              sx={{
                color: "accent.emerald",
                bgcolor: "action.hover",
                fontWeight: 700,
                mb: 1.5,
              }}
            />
            <Typography
              variant="h4"
              fontWeight={900}
              gutterBottom
              sx={{ color: "text.primary", fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
            >
              Plans Designed to Scale With Your Portfolio
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Start free today and upgrade as you acquire additional flats and complexes.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
              gap: 3.5,
              alignItems: "stretch",
            }}
          >
            {plans.map((p, idx) => (
              <Paper
                key={idx}
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: "20px",
                  bgcolor: p.popular
                    ? (isDark ? "action.selected" : "background.paper")
                    : "background.paper",
                  border: 1,
                  borderColor: p.popular
                    ? "primary.main"
                    : "divider",
                  boxShadow: p.popular
                    ? "0 20px 45px rgba(26,86,232,0.2)"
                    : isDark ? "none" : "0 4px 16px rgba(0,0,0,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                {p.popular && (
                  <Chip
                    label="RECOMMENDED"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      fontWeight: 800,
                      fontSize: "0.7rem",
                    }}
                  />
                )}
                <Typography variant="subtitle2" color="primary.main" fontWeight={700}>
                  {p.badge}
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight={800}
                  sx={{ color: "text.primary", mt: 0.5 }}
                >
                  {p.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 1, minHeight: 40 }}
                >
                  {p.desc}
                </Typography>

                <Box sx={{ my: 3, display: "flex", alignItems: "baseline", gap: 1 }}>
                  <Typography
                    variant="h3"
                    fontWeight={900}
                    sx={{ color: "text.primary" }}
                  >
                    {p.price}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {p.period}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 4, flexGrow: 1 }}>
                  {p.features.map((feat, fIdx) => (
                    <Box key={fIdx} sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                      <CheckCircleOutlineIcon sx={{ color: "success.main", fontSize: 18 }} />
                      <Typography variant="body2" sx={{ color: "text.primary" }}>
                        {feat}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Button
                  fullWidth
                  variant={p.popular ? "contained" : "outlined"}
                  onClick={() => router.push("/signup")}
                  sx={{
                    py: 1.25,
                    borderRadius: "10px",
                    fontWeight: 700,
                    textTransform: "none",
                    background: p.popular ? "linear-gradient(135deg, #1a56e8, #3575f0)" : "transparent",
                    borderColor: p.popular ? "transparent" : "divider",
                    color: p.popular ? "primary.contrastText" : "text.primary",
                    "&:hover": {
                      borderColor: p.popular ? "transparent" : "primary.main",
                      bgcolor: p.popular ? undefined : "action.hover",
                    },
                  }}
                >
                  Choose {p.name}
                </Button>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Testimonials ── */}
      <Box
        sx={{
          py: { xs: 7, md: 10 },
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography variant="overline" sx={{ color: "accent.cyan", fontWeight: 700 }}>
              TRUSTED BY LEADERS
            </Typography>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ color: "text.primary", mt: 0.5, fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
            >
              What Real Estate Managers Say
            </Typography>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "18px",
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                boxShadow: isDark ? "none" : "0 4px 16px rgba(0,0,0,0.03)",
              }}
            >
              <Rating value={5} readOnly size="small" sx={{ mb: 2 }} />
              <Typography
                variant="body1"
                sx={{ color: "text.primary", fontStyle: "italic", lineHeight: 1.65, mb: 2.5 }}
              >
                &ldquo;Before Nivaasa, we maintained paper registers and spreadsheets across 4 apartment blocks.
                Now every payment is tracked, Aadhaar records are encrypted, and our team stays aligned on rent arrears.&rdquo;
              </Typography>
              <Typography variant="subtitle2" fontWeight={700} sx={{ color: "text.primary" }}>
                Rajesh Singhania
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Senior Property Director, Singhania Estates
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "18px",
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                boxShadow: isDark ? "none" : "0 4px 16px rgba(0,0,0,0.03)",
              }}
            >
              <Rating value={5} readOnly size="small" sx={{ mb: 2 }} />
              <Typography
                variant="body1"
                sx={{ color: "text.primary", fontStyle: "italic", lineHeight: 1.65, mb: 2.5 }}
              >
                &ldquo;The Superadmin and delegated Admin workflow is a game-changer. I invited our on-site manager
                with restricted privileges, and our vacancy turnaround decreased from 3 weeks to 4 days.&rdquo;
              </Typography>
              <Typography variant="subtitle2" fontWeight={700} sx={{ color: "text.primary" }}>
                Meera Krishnan
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Chairperson, Skyline Residential Society
              </Typography>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* ── FAQ Accordion ── */}
      <Box id="faqs" sx={{ py: { xs: 7, md: 10 } }}>
        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h4"
              fontWeight={800}
              gutterBottom
              sx={{ color: "text.primary", fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Everything you need to know about setting up and scaling your operations.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {faqs.map((f, idx) => (
              <Accordion
                key={idx}
                elevation={0}
                sx={{
                  bgcolor: "background.paper",
                  color: "text.primary",
                  borderRadius: "14px !important",
                  border: 1,
                  borderColor: "divider",
                  "&:before": { display: "none" },
                  boxShadow: isDark ? "none" : "0 2px 10px rgba(0,0,0,0.02)",
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {f.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", lineHeight: 1.65 }}
                  >
                    {f.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Bottom High-Impact CTA ── */}
      <Container maxWidth="md" sx={{ mb: 10, px: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 6 },
            borderRadius: "24px",
            background: isDark
              ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
              : "linear-gradient(135deg, #1a56e8 0%, #1e40af 100%)",
            border: 1,
            borderColor: "divider",
            textAlign: "center",
            boxShadow: "0 20px 50px rgba(26, 86, 232, 0.25)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Typography
            variant="h3"
            fontWeight={900}
            color="primary.contrastText"
            gutterBottom
            sx={{ fontSize: { xs: "1.75rem", sm: "2.3rem", md: "2.8rem" } }}
          >
            Ready to Modernize Your Property Operations?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: isDark ? "rgba(255, 255, 255, 0.78)" : "rgba(255, 255, 255, 0.92)",
              maxWidth: 600,
              mx: "auto",
              mb: 4,
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
            }}
          >
            Join forward-thinking property owners and managers. Register your Superadmin account
            in under 60 seconds with instant email verification.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="large"
              id="cta-bottom-signup-btn"
              onClick={() => router.push("/signup")}
              endIcon={<ArrowForwardIcon />}
              sx={{
                height: 52,
                px: 4,
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "1rem",
                textTransform: "none",
                bgcolor: isDark ? "primary.main" : "#ffffff",
                background: isDark
                  ? "linear-gradient(135deg, #1a56e8, #3575f0)"
                  : "#ffffff",
                color: isDark ? "#ffffff" : "#1a56e8",
                boxShadow: isDark
                  ? "0 6px 20px rgba(26, 86, 232, 0.4)"
                  : "0 6px 20px rgba(0, 0, 0, 0.18)",
                transition: "all 0.2s ease",
                "&:hover": {
                  background: isDark
                    ? "linear-gradient(135deg, #1441d4, #1a56e8)"
                    : "#f8fafc",
                  bgcolor: isDark ? "#1441d4" : "#f8fafc",
                  color: isDark ? "#ffffff" : "#1441d4",
                  transform: "translateY(-2px)",
                  boxShadow: isDark
                    ? "0 8px 24px rgba(26, 86, 232, 0.5)"
                    : "0 8px 24px rgba(0, 0, 0, 0.22)",
                },
                "&:active, &.Mui-focusVisible": {
                  background: isDark
                    ? "linear-gradient(135deg, #1034ab, #1441d4)"
                    : "#eef2f6",
                  color: isDark ? "#ffffff" : "#1034ab",
                  transform: "translateY(0px)",
                },
              }}
            >
              Get Started Free Today
            </Button>
            <Button
              variant="outlined"
              size="large"
              id="cta-bottom-login-btn"
              onClick={() => router.push("/login")}
              sx={{
                height: 52,
                px: 3.5,
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "1rem",
                textTransform: "none",
                color: "#ffffff",
                borderColor: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.5)",
                bgcolor: "transparent",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#ffffff",
                  bgcolor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.16)",
                  color: "#ffffff",
                  transform: "translateY(-2px)",
                },
                "&:active, &.Mui-focusVisible": {
                  borderColor: "#ffffff",
                  bgcolor: isDark ? "rgba(255, 255, 255, 0.18)" : "rgba(255, 255, 255, 0.25)",
                  color: "#ffffff",
                  transform: "translateY(0px)",
                },
              }}
            >
              Sign In to Existing Portal
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* ── Footer ── */}
      <Box
        sx={{
          py: 4,
          mt: "auto",
          textAlign: "center",
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          transition: "background-color 0.25s ease, border-color 0.25s ease",
        }}
      >
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          © {new Date().getFullYear()} Nivaasa • Tenant Management System. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
