import { Navigate, Route, Routes } from "react-router-dom";
import { isLogin } from "./api/user";
import MainLayout from "./layouts/MainLayout";
import PageNotFound from "./pages/PageNotFound";
import ProductsPage from "./pages/ProductsPage";
import OrderPage from "./pages/OrderPage";
import ProductInfoPage from "./pages/ProductInfoPage";
import MapPage from "./pages/MapPage";
import UserPage from "./pages/UserPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";

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
        <MainLayout>
            <Routes>
                <Route path="*" element={<PrivateRoute element={<PageNotFound />} />} />
                <Route path="/" element={<PrivateRoute element={<DashboardPage />} />} />
                <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage />} />} />
                <Route path="/product" element={<PrivateRoute element={<ProductsPage />} />} />
                <Route path="/product/edit/:id" element={<PrivateRoute element={<ProductInfoPage />} />} />
                <Route path="/order" element={<PrivateRoute element={<OrderPage />} />} />
                <Route path="/order/map" element={<PrivateRoute element={<MapPage />} />} />
                <Route path="/user" element={<PrivateRoute element={<UserPage />} />} />
                <Route path="/account" element={<PrivateRoute element={<AccountPage />} />} />
                <Route path="/login" element={<AuthRoute element={<LoginPage />} />} />
            </Routes>
        </MainLayout>
    );
};
export default App;