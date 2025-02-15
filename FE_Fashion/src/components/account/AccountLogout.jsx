import { useTranslation } from "react-i18next";
import { logout } from "../../api/user";
import { showSuccessNoti } from "../../utils/toastify";
import { useNavigate } from "react-router-dom";

const AccountLogout = () => {
    const navigate = useNavigate();
    const { t } = useTranslation("global");
    const handleLogoutUser = () => {
        logout();
        showSuccessNoti(t("account.logout.toast"));
        navigate("/login");
    }
    return (
        <div className="w-1/2 mx-auto">
            <p className="font-bold sm: text-2xl text-center">{t("account.logout.title")}</p>
            <p className="sm:text-base text-center text-sm font-medium opacity-75 mt-2 mb-6">{t("account.logout.subtitle")}</p>
            <button className=" w-full bg-[rgb(62,24,0)] sm:py-4 py-3 text-white md:text-lg font-bold" onClick={handleLogoutUser}>
                {t('account.logout.btn')}
            </button>
        </div>
    )
}

export default AccountLogout;