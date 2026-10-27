"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
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

export default function Home() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setMounted(false);
    const timer = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { value: "99.4%", label: "On-Time Rent Collection", sub: "Automated tracking & alerts" },
    { value: "3.5x", label: "Faster Tenant Onboarding", sub: "Digital Aadhaar & lease KYC" },
    { value: "10,000+", label: "Units Managed", sub: "Across residential & commercial" },
    { value: "100%", label: "Data Isolation", sub: "Multi-tenant encrypted vaults" },
  ];

  const features = [
    {
      icon: <ApartmentIcon sx={{ fontSize: 32, color: "#38bdf8" }} />,
      tag: "INVENTORY",
      title: "Building & Flat Matrix",
      description:
        "Manage unlimited buildings, blocks, and floor layouts with instant visual badges for occupied, vacant, and notice-period flats.",
    },
    {
      icon: <PeopleAltOutlinedIcon sx={{ fontSize: 32, color: "#10b981" }} />,
      tag: "COMPLIANCE",
      title: "Tenant Records & Aadhaar KYC",
      description:
        "Store complete tenant profiles, emergency contacts, occupant headcounts, security deposit ledgers, and encrypted Aadhaar cards.",
    },
    {
      icon: <MonetizationOnOutlinedIcon sx={{ fontSize: 32, color: "#f59e0b" }} />,
      tag: "CASH FLOW",
      title: "Real-Time Rent Ledgers",
      description:
        "Track pending dues, log offline and online payments, generate receipt histories, and visualize revenue across months and floors.",
    },
    {
      icon: <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 32, color: "#a855f7" }} />,
      tag: "GOVERNANCE",
      title: "Delegated Property Admins",
      description:
        "Superadmins can invite property managers per complex with email-verified credentials and strictly scoped organization isolation.",
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 32, color: "#ec4899" }} />,
      tag: "SPEED",
      title: "Instant Vacancy Turnaround",
      description:
        "One-click tenant checkout, automated security deposit adjustments, and immediate relisting of vacant inventory.",
    },
    {
      icon: <ShieldOutlinedIcon sx={{ fontSize: 32, color: "#6366f1" }} />,
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
      a: "Yes. TenantAdmin lets you register as many building complexes, towers, and standalone homes as you need under your single Superadmin account.",
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#070b14",
        color: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* ── Background Glow Effects ── */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "1000px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(26,86,232,0.18) 0%, rgba(139,92,246,0.1) 40%, rgba(7,11,20,0) 70%)",
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
          bgcolor: "rgba(7, 11, 20, 0.8)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          zIndex: 1100,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between", py: 1.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                cursor: "pointer",
              }}
              onClick={() => router.push("/")}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #1a56e8, #3b82f6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 20px rgba(26,86,232,0.5)",
                }}
              >
                <ApartmentIcon sx={{ color: "#fff", fontSize: 24 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={800}
                  sx={{
                    background: "linear-gradient(135deg, #ffffff, #94a3b8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.5px",
                    lineHeight: 1.1,
                  }}
                >
                  TenantAdmin
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.68rem" }}>
                  Property Intelligence
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation Links */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 3.5 }}>
              <Button
                variant="text"
                href="#features"
                sx={{ color: "#94a3b8", textTransform: "none", fontWeight: 500, "&:hover": { color: "#fff" } }}
              >
                Features
              </Button>
              <Button
                variant="text"
                href="#demo"
                sx={{ color: "#94a3b8", textTransform: "none", fontWeight: 500, "&:hover": { color: "#fff" } }}
              >
                Interactive Demo
              </Button>
              <Button
                variant="text"
                href="#workflow"
                sx={{ color: "#94a3b8", textTransform: "none", fontWeight: 500, "&:hover": { color: "#fff" } }}
              >
                Workflow
              </Button>
              <Button
                variant="text"
                href="#pricing"
                sx={{ color: "#94a3b8", textTransform: "none", fontWeight: 500, "&:hover": { color: "#fff" } }}
              >
                Pricing
              </Button>
            </Box>

            {/* Auth Actions */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {mounted && user ? (
                <Button
                  variant="contained"
                  id="nav-dashboard-btn"
                  onClick={() => router.push("/admin/dashboard")}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    borderRadius: "10px",
                    px: 2.5,
                    py: 0.9,
                    fontWeight: 600,
                    textTransform: "none",
                    background: "linear-gradient(135deg, #1a56e8, #3575f0)",
                    boxShadow: "0 4px 16px rgba(26,86,232,0.4)",
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
                      color: "#cbd5e1",
                      fontWeight: 600,
                      textTransform: "none",
                      px: 2,
                      "&:hover": { color: "#ffffff", bgcolor: "rgba(255,255,255,0.06)" },
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
                      px: 2.5,
                      py: 0.85,
                      fontWeight: 600,
                      textTransform: "none",
                      background: "linear-gradient(135deg, #1a56e8, #3575f0)",
                      boxShadow: "0 4px 16px rgba(26,86,232,0.4)",
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
          </Toolbar>
        </Container>
      </AppBar>

      {/* ── Hero Section ── */}
      <Box
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 11 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Chip
            icon={<SecurityOutlinedIcon sx={{ fontSize: "16px !important", color: "#60a5fa !important" }} />}
            label="Multi-Tenant Property Operating System"
            size="small"
            sx={{
              mb: 3,
              px: 1.75,
              py: 2.2,
              bgcolor: "rgba(59, 130, 246, 0.12)",
              color: "#93c5fd",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              fontWeight: 600,
              fontSize: "0.85rem",
              backdropFilter: "blur(8px)",
            }}
          />

          <Typography
            component="h1"
            variant="h2"
            fontWeight={900}
            sx={{
              fontSize: { xs: "2.6rem", sm: "3.75rem", md: "4.4rem" },
              lineHeight: 1.1,
              letterSpacing: "-2px",
              mb: 3,
            }}
          >
            Manage Rental Properties with{" "}
            <Box
              component="span"
              sx={{
                background: "linear-gradient(135deg, #60a5fa 0%, #38bdf8 50%, #c084fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Total Business Clarity
            </Box>
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "#94a3b8",
              fontWeight: 400,
              maxWidth: 720,
              mx: "auto",
              mb: 5,
              lineHeight: 1.65,
              fontSize: { xs: "1.05rem", sm: "1.2rem" },
            }}
          >
            The all-in-one platform engineered for modern property owners, real estate
            managers, and housing societies. Automate tenant Aadhaar KYC, monitor rent
            arrears, and invite managers with isolated organization security.
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
                height: 54,
                px: 4,
                borderRadius: "12px",
                fontSize: "1.05rem",
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
                height: 54,
                px: 3.5,
                borderRadius: "12px",
                fontSize: "1.05rem",
                fontWeight: 600,
                textTransform: "none",
                color: "#e2e8f0",
                borderColor: "rgba(255, 255, 255, 0.2)",
                bgcolor: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(8px)",
                "&:hover": {
                  borderColor: "#60a5fa",
                  bgcolor: "rgba(59, 130, 246, 0.1)",
                },
              }}
            >
              {mounted && user ? "My Account" : "Sign In to Portal"}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── Business ROI Metrics Bar ── */}
      <Container maxWidth="lg" sx={{ mb: 10, position: "relative", zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: "20px",
            background: "linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
              gap: 3,
              textAlign: "center",
            }}
          >
            {stats.map((s, idx) => (
              <Box key={idx} sx={{ px: 1 }}>
                <Typography
                  variant="h3"
                  fontWeight={900}
                  sx={{
                    background: "linear-gradient(135deg, #60a5fa, #38bdf8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 0.5,
                  }}
                >
                  {s.value}
                </Typography>
                <Typography variant="body2" color="#e2e8f0" fontWeight={700}>
                  {s.label}
                </Typography>
                <Typography variant="caption" color="#64748b" display="block">
                  {s.sub}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Container>

      {/* ── Interactive Live Demo & Mockup Preview ── */}
      <Box id="demo" sx={{ py: 10, bgcolor: "rgba(15, 23, 42, 0.6)", position: "relative" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Chip
              label="PRODUCT EXPERIENCE"
              size="small"
              sx={{ color: "#38bdf8", bgcolor: "rgba(56, 189, 248, 0.1)", fontWeight: 700, mb: 1.5 }}
            />
            <Typography variant="h4" fontWeight={800} gutterBottom>
              See TenantAdmin in Action
            </Typography>
            <Typography variant="body1" color="#94a3b8" maxWidth={600} mx="auto">
              Explore how property managers monitor flat occupancy, verify tenant records,
              and review revenue streams in real time.
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                sx={{
                  bgcolor: "rgba(30, 41, 59, 0.6)",
                  p: 0.6,
                  borderRadius: "14px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  "& .MuiTabs-indicator": { display: "none" },
                }}
              >
                <Tab
                  label="🏢 Flat Matrix & Status"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "10px",
                    color: activeTab === 0 ? "#fff" : "#94a3b8",
                    bgcolor: activeTab === 0 ? "#1a56e8" : "transparent",
                    minHeight: 40,
                    px: 3,
                  }}
                />
                <Tab
                  label="👤 Tenant Aadhaar KYC"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "10px",
                    color: activeTab === 1 ? "#fff" : "#94a3b8",
                    bgcolor: activeTab === 1 ? "#1a56e8" : "transparent",
                    minHeight: 40,
                    px: 3,
                  }}
                />
                <Tab
                  label="📊 Cash Flow & Rent"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "10px",
                    color: activeTab === 2 ? "#fff" : "#94a3b8",
                    bgcolor: activeTab === 2 ? "#1a56e8" : "transparent",
                    minHeight: 40,
                    px: 3,
                  }}
                />
              </Tabs>
            </Box>
          </Box>

          {/* Interactive Screen Preview Container */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 4 },
              borderRadius: "24px",
              bgcolor: "#0f172a",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
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
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#ef4444" }} />
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#f59e0b" }} />
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#10b981" }} />
              <Typography variant="caption" sx={{ color: "#64748b", ml: 2 }}>
                tenantadmin.app/admin/{activeTab === 0 ? "flats" : activeTab === 1 ? "tenants" : "dashboard"}
              </Typography>
            </Box>

            {/* TAB 0: FLATS PREVIEW */}
            {activeTab === 0 && (
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      Building: Grand Horizon Heights (Tower A)
                    </Typography>
                    <Typography variant="caption" color="#94a3b8">
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
                    sx={{
                      p: 2.5,
                      borderRadius: "14px",
                      bgcolor: "#1e293b",
                      border: "1px solid #10b981",
                      boxShadow: "0 4px 15px rgba(16, 185, 129, 0.15)",
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight={700}>Flat 201</Typography>
                      <Chip label="Occupied" size="small" color="success" sx={{ height: 20, fontSize: "0.7rem" }} />
                    </Box>
                    <Typography variant="body2" color="#e2e8f0">Tenant: Vikram Malhotra</Typography>
                    <Typography variant="caption" color="#94a3b8" display="block">Rent: ₹24,000/mo • Balance: ₹0</Typography>
                  </Paper>

                  <Paper
                    sx={{
                      p: 2.5,
                      borderRadius: "14px",
                      bgcolor: "#1e293b",
                      border: "1px dashed #f59e0b",
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight={700}>Flat 202</Typography>
                      <Chip label="Vacant" size="small" color="warning" sx={{ height: 20, fontSize: "0.7rem" }} />
                    </Box>
                    <Typography variant="body2" color="#94a3b8">Ready for Tenant Assignment</Typography>
                    <Typography variant="caption" color="#64748b" display="block">Target Rent: ₹22,000/mo</Typography>
                  </Paper>

                  <Paper
                    sx={{
                      p: 2.5,
                      borderRadius: "14px",
                      bgcolor: "#1e293b",
                      border: "1px solid #10b981",
                      boxShadow: "0 4px 15px rgba(16, 185, 129, 0.15)",
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight={700}>Flat 203</Typography>
                      <Chip label="Occupied" size="small" color="success" sx={{ height: 20, fontSize: "0.7rem" }} />
                    </Box>
                    <Typography variant="body2" color="#e2e8f0">Tenant: Ananya Roy</Typography>
                    <Typography variant="caption" color="#94a3b8" display="block">Rent: ₹26,500/mo • Balance: ₹0</Typography>
                  </Paper>
                </Box>
              </Box>
            )}

            {/* TAB 1: TENANT KYC PREVIEW */}
            {activeTab === 1 && (
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                  <Typography variant="h6" fontWeight={700}>
                    Active Tenant Verification & KYC Ledgers
                  </Typography>
                  <Chip icon={<FactCheckOutlinedIcon sx={{ fontSize: "16px !important", color: "#10b981 !important" }} />} label="Aadhaar Encrypted" size="small" color="success" variant="outlined" />
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Paper sx={{ p: 2, bgcolor: "#1e293b", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "#1a56e8" }}>VM</Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>Vikram Malhotra</Typography>
                        <Typography variant="caption" color="#94a3b8">Flat 201 • Contact: +91 98765 43210 • 3 Occupants</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Chip label="Deposit: ₹50,000" size="small" sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "#fff", mr: 1 }} />
                      <Chip label="KYC Verified" color="success" size="small" />
                    </Box>
                  </Paper>

                  <Paper sx={{ p: 2, bgcolor: "#1e293b", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "#8b5cf6" }}>AR</Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>Ananya Roy</Typography>
                        <Typography variant="caption" color="#94a3b8">Flat 203 • Contact: +91 98220 11223 • 2 Occupants</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Chip label="Deposit: ₹55,000" size="small" sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "#fff", mr: 1 }} />
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
                  <Typography variant="h6" fontWeight={700}>
                    Monthly Collection Breakdown & Floor Yield
                  </Typography>
                  <Typography variant="caption" color="#10b981" fontWeight={700}>
                    +18% YOY Growth
                  </Typography>
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
                  <Paper sx={{ p: 3, bgcolor: "#1e293b", borderRadius: "14px" }}>
                    <Typography variant="caption" color="#94a3b8" fontWeight={700}>TOTAL RENT PROCESSED</Typography>
                    <Typography variant="h4" fontWeight={800} color="#38bdf8" sx={{ my: 1 }}>₹2,24,500</Typography>
                    <Typography variant="caption" color="#10b981">98.5% collected on or before the 5th</Typography>
                  </Paper>
                  <Paper sx={{ p: 3, bgcolor: "#1e293b", borderRadius: "14px" }}>
                    <Typography variant="caption" color="#94a3b8" fontWeight={700}>FLOOR PERFORMANCE</Typography>
                    <Typography variant="body2" color="#e2e8f0" sx={{ mt: 1 }}>First Floor: ₹72,500 (3 Flats)</Typography>
                    <Typography variant="body2" color="#e2e8f0" sx={{ mt: 0.5 }}>Second Floor: ₹78,000 (3 Flats)</Typography>
                    <Typography variant="body2" color="#e2e8f0" sx={{ mt: 0.5 }}>Ground Floor: ₹74,000 (3 Flats)</Typography>
                  </Paper>
                </Box>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>

      {/* ── Business Value Pillars (Grid of 6) ── */}
      <Box id="features" sx={{ py: 11, position: "relative" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <Chip label="ENTERPRISE CAPABILITIES" size="small" sx={{ color: "#818cf8", bgcolor: "rgba(99, 102, 241, 0.1)", fontWeight: 700, mb: 1.5 }} />
            <Typography variant="h4" fontWeight={900} gutterBottom>
              Engineered for Serious Property Owners
            </Typography>
            <Typography variant="body1" color="#94a3b8" maxWidth={650} mx="auto">
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
                  bgcolor: "#111827",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    borderColor: "rgba(56, 189, 248, 0.4)",
                    boxShadow: "0 16px 36px rgba(0, 0, 0, 0.5)",
                  },
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Box sx={{ p: 1.25, borderRadius: "12px", bgcolor: "rgba(255, 255, 255, 0.04)" }}>
                    {item.icon}
                  </Box>
                  <Chip label={item.tag} size="small" sx={{ fontSize: "0.65rem", fontWeight: 700, bgcolor: "rgba(255,255,255,0.06)", color: "#94a3b8" }} />
                </Box>
                <Typography variant="h6" fontWeight={700} color="#ffffff" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="#94a3b8" lineHeight={1.65}>
                  {item.description}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── 3-Step Workflow Section ── */}
      <Box id="workflow" sx={{ py: 10, bgcolor: "rgba(15, 23, 42, 0.4)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <Typography variant="overline" color="#38bdf8" fontWeight={700}>
              HOW IT WORKS
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
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
                  bgcolor: "rgba(30, 41, 59, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={900}
                  sx={{
                    color: "rgba(59, 130, 246, 0.2)",
                    fontFamily: "monospace",
                    mb: 1.5,
                  }}
                >
                  {ws.step}
                </Typography>
                <Typography variant="h6" fontWeight={700} color="#fff" gutterBottom>
                  {ws.title}
                </Typography>
                <Typography variant="body2" color="#94a3b8" lineHeight={1.6}>
                  {ws.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Pricing Tiers ── */}
      <Box id="pricing" sx={{ py: 11 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <Chip label="TRANSPARENT VALUE" size="small" sx={{ color: "#34d399", bgcolor: "rgba(52, 211, 153, 0.1)", fontWeight: 700, mb: 1.5 }} />
            <Typography variant="h4" fontWeight={900} gutterBottom>
              Plans Designed to Scale With Your Portfolio
            </Typography>
            <Typography variant="body1" color="#94a3b8">
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
                  p: 4,
                  borderRadius: "20px",
                  bgcolor: p.popular ? "#1e293b" : "#111827",
                  border: p.popular ? "2px solid #1a56e8" : "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: p.popular ? "0 20px 45px rgba(26,86,232,0.25)" : "none",
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
                      bgcolor: "#1a56e8",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "0.7rem",
                    }}
                  />
                )}
                <Typography variant="subtitle2" color="#60a5fa" fontWeight={700}>
                  {p.badge}
                </Typography>
                <Typography variant="h5" fontWeight={800} color="#fff" sx={{ mt: 0.5 }}>
                  {p.name}
                </Typography>
                <Typography variant="body2" color="#94a3b8" sx={{ mt: 1, minHeight: 40 }}>
                  {p.desc}
                </Typography>

                <Box sx={{ my: 3, display: "flex", alignItems: "baseline", gap: 1 }}>
                  <Typography variant="h3" fontWeight={900} color="#fff">
                    {p.price}
                  </Typography>
                  <Typography variant="body2" color="#94a3b8">
                    {p.period}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 4, flexGrow: 1 }}>
                  {p.features.map((feat, fIdx) => (
                    <Box key={fIdx} sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                      <CheckCircleOutlineIcon sx={{ color: "#10b981", fontSize: 18 }} />
                      <Typography variant="body2" color="#e2e8f0">
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
                    borderColor: p.popular ? "transparent" : "rgba(255,255,255,0.2)",
                    color: "#fff",
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
      <Box sx={{ py: 10, bgcolor: "rgba(15, 23, 42, 0.4)" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography variant="overline" color="#38bdf8" fontWeight={700}>
              TRUSTED BY LEADERS
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
              What Real Estate Managers Say
            </Typography>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4 }}>
            <Paper sx={{ p: 4, borderRadius: "18px", bgcolor: "#111827", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <Rating value={5} readOnly size="small" sx={{ mb: 2 }} />
              <Typography variant="body1" color="#cbd5e1" fontStyle="italic" lineHeight={1.65} sx={{ mb: 2.5 }}>
                &ldquo;Before TenantAdmin, we maintained paper registers and spreadsheets across 4 apartment blocks.
                Now every payment is tracked, Aadhaar records are encrypted, and our team stays aligned on rent arrears.&rdquo;
              </Typography>
              <Typography variant="subtitle2" fontWeight={700} color="#fff">Rajesh Singhania</Typography>
              <Typography variant="caption" color="#64748b">Senior Property Director, Singhania Estates</Typography>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: "18px", bgcolor: "#111827", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <Rating value={5} readOnly size="small" sx={{ mb: 2 }} />
              <Typography variant="body1" color="#cbd5e1" fontStyle="italic" lineHeight={1.65} sx={{ mb: 2.5 }}>
                &ldquo;The Superadmin and delegated Admin workflow is a game-changer. I invited our on-site manager
                with restricted privileges, and our vacancy turnaround decreased from 3 weeks to 4 days.&rdquo;
              </Typography>
              <Typography variant="subtitle2" fontWeight={700} color="#fff">Meera Krishnan</Typography>
              <Typography variant="caption" color="#64748b">Chairperson, Skyline Residential Society</Typography>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* ── FAQ Accordion ── */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Frequently Asked Questions
            </Typography>
            <Typography variant="body2" color="#94a3b8">
              Everything you need to know about setting up and scaling your operations.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {faqs.map((f, idx) => (
              <Accordion
                key={idx}
                elevation={0}
                sx={{
                  bgcolor: "#111827",
                  color: "#fff",
                  borderRadius: "14px !important",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#60a5fa" }} />}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {f.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="#94a3b8" lineHeight={1.65}>
                    {f.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Bottom High-Impact CTA ── */}
      <Container maxWidth="md" sx={{ mb: 10 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 6 },
            borderRadius: "24px",
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            border: "1px solid rgba(59, 130, 246, 0.4)",
            textAlign: "center",
            boxShadow: "0 20px 50px rgba(26, 86, 232, 0.25)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Typography variant="h3" fontWeight={900} color="#fff" gutterBottom>
            Ready to Modernize Your Property Operations?
          </Typography>
          <Typography variant="body1" color="#94a3b8" maxWidth={600} mx="auto" sx={{ mb: 4 }}>
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
                background: "linear-gradient(135deg, #1a56e8, #3575f0)",
                boxShadow: "0 6px 20px rgba(26,86,232,0.4)",
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
                color: "#e2e8f0",
                borderColor: "rgba(255, 255, 255, 0.2)",
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
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          bgcolor: "rgba(11, 17, 32, 0.95)",
        }}
      >
        <Typography variant="body2" color="#64748b">
          © {new Date().getFullYear()} TenantAdmin • Tenant Management System. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
