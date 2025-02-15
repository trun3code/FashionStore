const AccountSideBar = ({ active, changeActive }) => {
    const titleBars = [
        "Tài khoản",
        "Đổi mật khẩu",
        "Đăng xuất"
    ]
    return (
        <div className="w-full flex flex-row justify-center mt-[2.5rem]">
            {titleBars.map((title, index) => (
                <div key={index} className={`mx-5 my-0 border-2 h-[3rem] lg:justtify-left 
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