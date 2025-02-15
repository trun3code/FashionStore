import { useEffect, useState } from "react";
import { getFullUserInfo } from "../api/user";
import { useNavigate } from "react-router-dom";
import { showErrorNoti } from "../utils/toastify";
import AccountSideBar from "../components/account/AccountSideBar";
import AccountLogout from "../components/account/AccountLogout";
import AccountPersonal from "../components/account/AccountPersonal";
import AccountPassword from "../components/account/AccountPassword";

const AccountPage = () => {
    const navigate = useNavigate();
    const [activeContent, setActiveContent] = useState(0)
    const [user, setUser] = useState({});
    async function fetchData() {
        const response = await getFullUserInfo();
        if (response?.status != 200) {
            showErrorNoti("Đăng nhập hết hạn")
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
            ? <AccountPassword />
            : <AccountLogout />

    return (
        <div className="py-10 h-full">
            <div className="w-full">
                <AccountSideBar active={activeContent} changeActive={(index) => setActiveContent(index)} />
            </div>
            <div className=" max-w-screen-2xl flex lg:flex-row flex-col justify-between py-8 2xl:px-0 px-2 lg:space-y-0 space-y-10">
                <div className="w-full lg:pl-0">
                    {Content}
                </div>
            </div>
        </div>
    );
}

export default AccountPage;