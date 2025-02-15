import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./Header";
import Footer from "./Footer";
import { useSidebarStore } from "../states/sidebar";
import Policy from "./Policy";
import { isLogin } from "../api/user";

const MainLayout = ({ children }) => {
  const login = isLogin();
  const location = useLocation();
  const { sideBarOpen, searchOpen } = useSidebarStore();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);

  return (
    <>
      <Header isAuth={location.pathname==="/login" || location.pathname==="/signup"}/>
      {sideBarOpen || searchOpen &&
        <div className="w-full h-screen bg-black bg-opacity-80 top-0 left-0 fixed z-30 pointer-events-none overflow-hidden"></div>
      }
      <main className={`${searchOpen || sideBarOpen ? "touch-none pointer-events-none :" : ""}`}>
        {children}
        <ToastContainer />
      </main>
      {
        login && <Policy />
      }
      <Footer />
    </>
  );
};

export default MainLayout;
