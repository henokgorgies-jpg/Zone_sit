import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import "./lib/i18n/config";
import { PublicLayout } from "./components/layout/PublicLayout";
import { AdminLayout } from "./components/admin/AdminLayout";
import Index from "./pages/Index";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Documents from "./pages/Documents";
import Auth from "./pages/Auth";
import Tenders from "./pages/Tenders";
import TenderDetail from "./pages/TenderDetail";
import PageDetail from "./pages/PageDetail";
import Gallery from "./pages/Gallery";
import Engagement from "./pages/Engagement";
import FAQs from "./pages/FAQs";
import Dashboard from "./pages/admin/Dashboard";
import PagesList from "./pages/admin/PagesList";
import PagesForm from "./pages/admin/PagesForm";
import NewsList from "./pages/admin/NewsList";
import NewsForm from "./pages/admin/NewsForm";
import ServicesList from "./pages/admin/ServicesList";
import ServicesForm from "./pages/admin/ServicesForm";
import TendersList from "./pages/admin/TendersList";
import TendersForm from "./pages/admin/TendersForm";
import DocumentsList from "./pages/admin/DocumentsList";
import DocumentsForm from "./pages/admin/DocumentsForm";
import ReportsList from "./pages/admin/ReportsList";
import ReportsForm from "./pages/admin/ReportsForm";
import Settings from "./pages/admin/Settings";
import Reports from "./pages/Reports";
import LeadershipList from "./pages/admin/LeadershipList";
import LeadershipForm from "./pages/admin/LeadershipForm";
import Leadership from "./pages/Leadership";
import DepartmentsList from "./pages/admin/DepartmentsList";
import DepartmentsForm from "./pages/admin/DepartmentsForm";
import Departments from "./pages/Departments";
import AboutManagement from "./pages/admin/AboutManagement";
import PortalManagement from "./pages/admin/PortalManagement";
import MediaList from "./pages/admin/MediaList";
import MediaForm from "./pages/admin/MediaForm";
import EngagementList from "./pages/admin/EngagementList";
import FAQList from "./pages/admin/FAQList";
import FAQForm from "./pages/admin/FAQForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:slug" element={<NewsDetail />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/tenders" element={<Tenders />} />
              <Route path="/tenders/:slug" element={<TenderDetail />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/leadership" element={<Leadership />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/page/gallery" element={<Gallery />} />
              <Route path="/page/engagement" element={<Engagement />} />
              <Route path="/page/faqs" element={<FAQs />} />
              <Route path="/page/:slug" element={<PageDetail />} />
            </Route>

            {/* Auth */}
            <Route path="/admin" element={<Auth />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="pages" element={<PagesList />} />
              <Route path="pages/new" element={<PagesForm />} />
              <Route path="pages/:id" element={<PagesForm />} />
              <Route path="news" element={<NewsList />} />
              <Route path="news/new" element={<NewsForm />} />
              <Route path="news/:id" element={<NewsForm />} />
              <Route path="services" element={<ServicesList />} />
              <Route path="services/new" element={<ServicesForm />} />
              <Route path="services/:id" element={<ServicesForm />} />
              <Route path="documents" element={<DocumentsList />} />
              <Route path="documents/new" element={<DocumentsForm />} />
              <Route path="documents/:id" element={<DocumentsForm />} />
              <Route path="portal" element={<PortalManagement />} />
              <Route path="tenders" element={<TendersList />} />
              <Route path="tenders/new" element={<TendersForm />} />
              <Route path="tenders/:id" element={<TendersForm />} />
              <Route path="reports" element={<ReportsList />} />
              <Route path="reports/new" element={<ReportsForm />} />
              <Route path="reports/:id" element={<ReportsForm />} />
              <Route path="leadership" element={<LeadershipList />} />
              <Route path="leadership/new" element={<LeadershipForm />} />
              <Route path="leadership/:id" element={<LeadershipForm />} />
              <Route path="departments" element={<DepartmentsList />} />
              <Route path="departments/new" element={<DepartmentsForm />} />
              <Route path="departments/:id" element={<DepartmentsForm />} />
              <Route path="about" element={<AboutManagement />} />
              <Route path="media" element={<MediaList />} />
              <Route path="media/new" element={<MediaForm />} />
              <Route path="media/:id" element={<MediaForm />} />
              <Route path="engagements" element={<EngagementList />} />
              <Route path="faqs" element={<FAQList />} />
              <Route path="faqs/new" element={<FAQForm />} />
              <Route path="faqs/:id" element={<FAQForm />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
