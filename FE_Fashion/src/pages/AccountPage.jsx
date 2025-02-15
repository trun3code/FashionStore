import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getFullUserInfo } from "../api/user";
import { useNavigate } from "react-router-dom";
import { showErrorNoti } from "../utils/toastify";
import PageTitle from "../layouts/PageTitle";
import AccountSideBar from "../components/account/AccountSideBar";
import AccountLogout from "../components/account/AccountLogout";
import AccountPersonal from "../components/account/AccountPersonal";
import AccountOrder from "../components/account/AccountOrder";
import AccountAddress from "../components/account/AccountAddress";
import AccountPassword from "../components/account/AccountPassword";

const AccountPage = () => {
    const { t } = useTranslation("global");
    const navigate = useNavigate();
    const [activeContent, setActiveContent] = useState(0)
    const [user, setUser] = useState({});
    async function fetchData() {
        const response = await getFullUserInfo();
        if (response.status != 200) {
            showErrorNoti(t("account.login-expired"))
            navigate("/login");
            return;
        }
        setUser(response.data);
    }
    useEffect(() => {
        fetchData();
    }, [])
    const Content = activeContent == 0
        ? <AccountPersonal data={user} />
        : activeContent == 1
            ? <AccountOrder />
            : activeContent == 2
                ? <AccountAddress data={user} />
                : activeContent == 3
                    ? <AccountPassword />
                    : <AccountLogout />

    return (
        <div className="py-10">
            <PageTitle title={t("page-title.account")} subtitle={t("page-title.account-sub")} />
            {/* {user ? */}
            <div className="flex w-full justify-center">
                <div className="w-full max-w-screen-2xl flex  lg:flex-row flex-col justify-between py-8 2xl:px-0 px-2 lg:space-y-0 space-y-10">
                    <div className="lg:w-1/5 lg:min-w-[230px] w-full  overflow-auto">
                        <AccountSideBar active={activeContent} changeActive={(index) => setActiveContent(index)} />
                    </div>
                    <div className="lg:w-3/4 w-full lg:pl-0">
                        {Content}
                    </div>
                </div>
            </div>
            {/* // : <RequiredView />} */}
        </div>
    );
}

export default AccountPage;