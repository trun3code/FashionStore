import { FaHamburger} from "react-icons/fa";

const Header = ({ toggle, setToggle }) => {
    return (
        <div className=" h-[5rem] flex flex-row items-center px-10 space-x-4 z-10 fixed top-0">
            <FaHamburger className="text-[#637381] w-[20px] h-[20px] cursor-pointer" onClick={() => setToggle(!toggle)} />
        </div>
    )
}

export default Header;