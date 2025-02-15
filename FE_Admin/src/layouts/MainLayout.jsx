import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./Header";
import NavBar from "./Navbar";

const MainLayout = ({ children }) => {
    const [toggleNavBar, setNavBar] = useState(true);
    const location = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [location]);
    return (
        <div className="flex flex-row relative bg-[rgb(249,250,251)]">
            {toggleNavBar && location.pathname != "/login" && <NavBar />}
            <div className="relative w-full">
                {location.pathname != "/login" &&
                    <Header toggle={toggleNavBar} setToggle={setNavBar} />
                }
                {children}
                <ToastContainer />
            </div>
        </div>

    )
}

export default MainLayout;