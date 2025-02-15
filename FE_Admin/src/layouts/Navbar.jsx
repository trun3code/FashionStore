import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";
import { useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import userLogo from "../assets/navbar/ic_user.svg";
import orderLogo from "../assets/navbar/ic_cart.svg";
import dashLogo from "../assets/navbar/ic_analytics.svg";
import productLogo from "../assets/navbar/ic_product.svg";
import profileLogo from "../assets/navbar/ic_profile.svg";
import { getUserName } from "../api/user";

const NavBar = () => {
    const path = useLocation();
    const navigate = useNavigate();
    const img = "https://res.cloudinary.com/dwx2u4ugr/image/upload/v1715076914/avatars/1_zriyqx.jpg";
    const [activeContent, setActiveContent] = useState(0);
    const navBarItems = [
        {
            title: "Dashboard",
            icon: dashLogo,
            path: "/dashboard"
        },
        {
            title: "Sản phẩm",
            icon: productLogo,
            path: "/product"
        },
        {
            title: "Đơn hàng",
            icon: orderLogo,
            path: "/order"
        },
        {
            title: "Người dùng",
            icon: userLogo,
            path: "/user"
        },
        {
            title: "Tài khoản",
            icon: profileLogo,
            path: "/account"
        },
    ]
    useEffect(() => {
        for (var i = 0; i < navBarItems.length; i++) {
            if (path.pathname.includes(navBarItems[i].path)) {
                document.title = navBarItems[i].title;
                setActiveContent(i);
                return;
            }
        }
    }, [path, navBarItems])
    return (
        <div className="h-screen transform transition-all duration-300 shadow translate-x-0 sticky top-0">
            <div className={`flex flex-col w-[280px] p-4  space-y-4`}>
                <div className="h-[3rem] w-full overflow-hidden">
                    <img className="cursor-pointer" src={logo} alt="" />
                </div>
                <div className="w-full bg-[rgb(241,241,241)] flex flex-row items-center p-4 rounded-[10px] space-x-4">
                    <img src={img} className="w-[40px] h-[40px] rounded-[50%]" alt="" />
                    <p className="font-bold text-[14px]">{getUserName()}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    {navBarItems.map((item, index) => (
                        <div key={index} className={`flex flex-row items-center 
                            space-x-5 py-3 px-4 cursor-pointer rounded-lg
                            ${activeContent == index ? "bg-[rgba(24,119,242,0.2)] text-[rgb(24,119,242)] font-bold" : "hover:bg-[rgb(245,245,245)] text-[#637381]"} `}
                            onClick={() => {
                                setActiveContent(index);
                                navigate(item.path);
                            }}>
                            <ReactSVG src={item.icon}
                                beforeInjection={(svg) => { svg.classList.add(activeContent == index ? 'active-svg' : 'inactive-svg') }} />
                            <p className="text-[14px] pt-1">{item.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NavBar;
