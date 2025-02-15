import { Navigate, Route, Routes } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { isLogin } from "./api/user";
import i18next from "i18next";
import global_vn from "../src/translations/vn/global.json";
import global_en from "../src/translations/en/global.json";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import PageNotFound from "./layouts/PageNotFound";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AccountPage from "./pages/AccountPage";

i18next.init({
    interpolation: { escapeValue: false },
    lng: localStorage.getItem("language") || 'vn',
    resources: {
        vn: {
            global: global_vn
        },
        en: {
            global: global_en
        }
    }
});

const PrivateRoute = ({ element }) => {
    const login = isLogin();
    return login ? element : <Navigate to={"/login"} />;
}
const AuthRoute = ({ element }) => {
    const login = isLogin();
    return !login ? element : <Navigate to={"/"} />
}
const App = () => {
    return (
        <I18nextProvider i18n={i18next}>
            <MainLayout>
                <Routes>
                    {/* auth */}
                    <Route path="/login" element={<AuthRoute element={<LoginPage />} />} />
                    <Route path="/signup" element={<AuthRoute element={<SignupPage />} />} />
                    {/* public */}
                    <Route path="*" element={<PageNotFound />} />
                    <Route Route path="/" element={<HomePage />} />
                    <Route Route path="/products" element={<ProductsPage />} />
                    <Route Route path="/products/search/:str" element={<ProductsPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    {/* private */}
                    <Route path="/cart" element={<PrivateRoute element={<CartPage />} />} />
                    <Route path="/account" element={<PrivateRoute element={<AccountPage />} />} />
                </Routes>
            </MainLayout>
        </I18nextProvider>
    );
};
export default App;