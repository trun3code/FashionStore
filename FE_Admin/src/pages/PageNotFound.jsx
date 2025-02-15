import { useNavigate } from "react-router-dom";
import notFoundImg from "../assets/notfound.svg";

const PageNotFound = () => {
    const navigate = useNavigate()
    return (
        <div className="w-full flex justify-center mt-[5rem]">
            <div className="max-w-screen-2xl text-center space-y-8 flex flex-col justify-center items-center">
                <p className="text-[26px] font-bold">Trang không tìm thấy!</p>
                <p className="max-w-[30rem] text-[rgb(99,115,129)]">
                    Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm
                </p>
                <img src={notFoundImg} alt="" />
                <button className="bg-[rgb(62,24,0)] text-white w-[20rem] sm:py-4 py-2 font-bold" onClick={() => navigate("/")}>
                    Về trang chính
                </button>
            </div>
        </div>
    );
}

export default PageNotFound;