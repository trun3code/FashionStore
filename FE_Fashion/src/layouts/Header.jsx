import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineArrowLeft, AiOutlineShoppingCart } from "react-icons/ai";
import { IoPersonOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { useSidebarStore } from "../states/sidebar";
import vnIcon from "../assets/vn.jpg";
import usIcon from "../assets/us.jpg";
import logo from "../assets/logo.png";

const Header = ({ isAuth }) => {
  const navigate = useNavigate();
  const [changeLanguage, setChangeLanguage] = useState(false);
  const { t, i18n } = useTranslation("global");
  const [searchStr, setSearchStr] = useState("");
  const handleChangeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  };
  const { sideBarOpen, toggleSideBar, closeSideBar, toggleSearch } = useSidebarStore();
  const handleSearch = () => {
    if (searchStr != "") {
      navigate("/products/search/" + searchStr);
    }
    else navigate("/products");
  }
  return (
    <header>
      <div className=" p-2  w-full bg-white sm:max-h-[5rem] max-h-[4rem] flex justify-center z-50 fixed shadow-2xl">
        <nav className="container w-full max-w-screen-2xl flex justify-between items-center flex-row">
          <div className="px-2 flex items-center justify-start space-x-3 cursor-pointer lg:hidden">
            <RxHamburgerMenu className="w-[1.5rem] h-[1.5rem] font-medium " onClick={() => toggleSideBar()} />
            {/* <RiSearch2Line className="w-[1.5rem] h-[1.5rem] font-medium" onClick={toggleSearch} /> */}
          </div>
          <div className="w-[10rem] flex items-center overflow-hidden justify-start hover:cursor-pointer">
            <Link to="/">
              <img src={logo} className="sm:w-[10rem] sm:max-h-none max-h-[5rem] sm:scale-100 scale-[1.2]" />
            </Link>
          </div>
          <div className={`lg:flex w-[7.5rem] lg:static lg:mb-1 lg:h-auto lg:shadow-none lg:p-0 shadow absolute sm:top-[5rem] top-[56px] left-0 z-10  transition-all bg-white 
            ${sideBarOpen ? "block h-screen " : "hidden"}`}>
            <div className={` text-lg hover:cursor-pointer lg:py-0 p-2 text-white font-bold bg-[rgb(227,191,54)] 
                ${sideBarOpen ? "block" : "hidden"} text-center relative`}>
              <AiOutlineArrowLeft className="absolute top-[14px]" onClick={() => closeSideBar()} />
              {t("header.category")}
            </div>
            {!isAuth &&
              <Link to="/products" onClick={closeSideBar}>
                <div className="text-lg font-medium hover:cursor-pointer  hover:text-[rgb(219,168,44)]">
                  {t("header.shop")}
                </div>
              </Link>
            }
          </div>

          <div className="w-[60%] lg:block hidden">
            <div className="relative">
              <input className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 
                rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder={t("search")} onChange={(e) => setSearchStr(e.target.value)} />
              <button className="absolute top-1 right-1 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm 
                text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none 
                disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button"
                onClick={handleSearch}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                </svg>
                {t("search-btn")}
              </button>
            </div>
          </div>
          <div className="lg:w-1/6 sm:w-1/4 md:min-w-[8rem] flex items-center justify-end">
            {!isAuth &&
              <>
                <Link className="sm:w-1/5 w-[2rem] sm:mx-0 mx-1" to="/cart">
                  <div className="w-full flex items-center sm:justify-start justify-center cursor-pointer">
                    <AiOutlineShoppingCart className="w-[1.5rem] h-[1.5rem] font-medium" />
                  </div>
                </Link>
                <Link className="sm:w-1/5 w-[2rem]" to='/account'>
                  <div className="flex items-center sm:justify-start justify-center cursor-pointer sm:mx-0 ">
                    <IoPersonOutline className="w-[1.5rem] h-[1.5rem] font-medium" />
                  </div>
                </Link>
              </>}
            <div className="sm:w-[52px] w-[40px] flex items-center cursor-pointer relative" onClick={() => setChangeLanguage(!changeLanguage)} >
              {i18n.language == "vn" ?
                <img className="w-[40px]" src={vnIcon} alt="vn_language" />
                : <img
                  className="w-[40px]"
                  src={usIcon}
                  alt="en_language"
                />
              }
              {changeLanguage && (
                <div className="absolute shadow w-36 top-10 right-1 rounded-xl transition-transform z-20 bg-white">
                  <div
                    className="flex row items-center px-1 py-1 hover:bg-[rgb(237,244,254)] rounded-t-xl"
                    onClick={() => handleChangeLanguage("vn")}>
                    <img className="w-[25px]" src={vnIcon} alt="vn_language" />
                    <span className="font-semibold">
                      {t("header.language.vn")}
                    </span>
                  </div>
                  <div className="flex row items-center px-1 py-1 rounded-b-xl hover:bg-[rgb(237,244,254)]" onClick={() => handleChangeLanguage("en")}>
                    <img className="w-[25px]" src={usIcon} alt="vn_language" />
                    <span className="font-semibold">
                      {t("header.language.en")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
