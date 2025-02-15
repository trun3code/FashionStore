import { useTranslation } from "react-i18next";

const AccountSideBar = ({ active, changeActive }) => {
    const { t } = useTranslation("global")
    const titleBars = [
        t("account.sidebar.personal"),
        t("account.sidebar.order"),
        t("account.sidebar.address"),
        t("account.sidebar.pass"),
        t("account.sidebar.logout")
    ]
    return (
        <div className="w-full lg:space-y-4 lg:space-x-0 space-x-4 flex lg:flex-col flex-row">
            {titleBars.map((title, index) => (
                <div key={index} className={`border-2 md:px-4 px-2 md:h-[4rem] h-[3rem] lg:justtify-left 
                    justify-center flex items-center font-semibold md:text-xl md:min-w-[230px] min-w-[11rem]
                    ${active == index ? "bg-[rgb(62,24,0)] font-bold text-white" : "cursor-pointer"}`}
                    onClick={() => changeActive(index)}>
                    {title}
                </div>
            ))}
        </div>
    )
}

export default AccountSideBar;