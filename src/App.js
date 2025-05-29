import {
  Routes,
  Route,
  Navigate,
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import "./styles/global.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Terms from "./pages/Terms";
import { Us } from "./pages/Us";
import Layout from "./components/Layout/Layout";
import MyBusiness from "./pages/MyBusiness";
import PriceList from "./pages/PriceList";
import AuthRoute from "./components/AuthRoute";
import { ProductProvider } from "./contexts/ProductContext";

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { pathname } = location;

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/terms" ||
    pathname === "/us";

  return (
    <div
      className="app"
      style={{
        backgroundImage: isAuthPage
          ? "url(https://storage.123fakturera.se/public/wallpapers/sverige43.jpg)"
          : "#f8fafc",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <main className={`container ${user ? "logged-in" : ""}`}>
        <Routes>
          <Route element={<AuthRoute requireAuth={false} />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/terms" element={<Terms />} />
          <Route path="/us" element={<Us />} />

          <Route element={<AuthRoute requireAuth={true} />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/myBusiness" element={<MyBusiness />} />
              <Route path="/pricelist" element={<PriceList />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <ProductProvider>
            <AppContent />
          </ProductProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
