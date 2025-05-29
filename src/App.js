import {
  Routes,
  Route,
  Navigate,
  BrowserRouter as Router,
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
  return (
    <div className={`app ${user ? "logged-in" : ""}`}>
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
