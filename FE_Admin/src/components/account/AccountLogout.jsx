import { useNavigate } from "react-router-dom";
import { logout } from "../../api/user";
import { showSuccessNoti } from "../../utils/toastify";

const AccountLogout = () => {
    const navigate = useNavigate();
    const handleLogoutUser = () => {
        logout();
        showSuccessNoti("Đăng xuất thành công");
        navigate("/login");
    }
    return (
        <div className="w-1/2 mx-auto">
            <p className="font-bold sm: text-2xl text-center">Đăng xuất</p>
            <p className="sm:text-base text-center text-sm font-medium opacity-75 mt-2 mb-6">Bạn có chắc đăng xuất tài khoản không?</p>
            <button className=" w-full bg-[rgb(62,24,0)] sm:py-4 py-3 text-white md:text-lg font-bold" onClick={handleLogoutUser}>
                Đăng xuất 
            </button>
        </div>
    )
}

export default AccountLogout;