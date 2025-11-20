import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Partners from "./pages/Partners";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import LoginAdmin from "./pages/LoginAdmin";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute"; // Import de la route privée
import PostEditor from "./pages/PostEditor";
import RegisterAdmin from "./pages/RegisterAdmin";
import AdminStats from "./pages/AdminStats";
import AdminSubscribers from "./pages/AdminSubscribers"; // 1. Importer le nouveau composant
import AdminLayout from "./pages/AdminLayout"; // Importer le layout
import HRMLayout from "./pages/HRMLayout";
import HRManagementPage from "./pages/HRManagementPage";
import Departments from "./pages/Departments";
import Employees from "./pages/Employees";
import ServicesRH from "./pages/ManageServices";
import Functions from "./pages/Functions";
import Salaries from "./pages/Salaries";
import Leaves from "./pages/Leaves";
import AboutHR from "./pages/AboutHR";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { ActiveSectionProvider } from "./pages/ActiveSectionContext";
import Training from "./pages/Training";
import Subscribe from "./pages/Subscribe";
import LegalNotice from "./pages/LegalNotice";
import { AuthProvider } from "./context/AuthContext";
import TermsOfUse from "./pages/TermsOfUse";
import UnderDevelopment from "./pages/UnderDevelopment";
function App() {
  const { t } = useTranslation();

  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      // On ne suit pas les visites des pages d'administration pour ne pas fausser les stats
      if (location.pathname.startsWith("/admin")) {
        return;
      }
      try {
        await fetch("`${process.env.REACT_APP_API_URL}/api`/visits", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ page: location.pathname }),
        });
      } catch (error) {
        console.error("Erreur lors du suivi de la visite:", error);
      }
    };

    trackVisit();
  }, [location]);

  return (
    <ActiveSectionProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/login-admin" element={<LoginAdmin />} />
            <Route path="/training" element={<Training />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/legalNotice" element={<LegalNotice />} />
            <Route path="/termsOfUse" element={<TermsOfUse />} />
            <Route path="/underDevelopment" element={<UnderDevelopment />} />
            <Route path="/LanguageSwitcher" element={<LanguageSwitcher />} />
            <Route path="/admin" element={<PrivateRoute />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="posts/new" element={<PostEditor />} />
              <Route path="posts/edit/:id" element={<PostEditor />} />
              <Route path="register" element={<RegisterAdmin />} />
              <Route path="stats" element={<AdminStats />} />
              <Route path="subscribers" element={<AdminSubscribers />} />
              {/* 2. Ajouter la nouvelle route */}
              <Route path="hrm" element={<HRMLayout />}>
                <Route index element={<HRManagementPage />} />
                <Route path="departments" element={<Departments />} />
                <Route path="employees" element={<Employees />} />
                <Route path="services" element={<ServicesRH />} />
                <Route path="functions" element={<Functions />} />
                <Route path="salaries" element={<Salaries />} />
                <Route path="leaves" element={<Leaves />} />
                <Route path="about" element={<AboutHR />} />
              </Route>
            </Route>
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ActiveSectionProvider>
  );
}

export default App;
