import { useNavigate } from "react-router-dom";
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { login } from "../api/user";
import { showSuccessNoti, showErrorNoti } from "../utils/toastify";

const LoginPage = () => {
    const navigate = useNavigate();
    const [hiddenPassword, setHideenPassword] = useState(true);
    const schema = z.object({
        email: z.string().trim().min(1, "Vui lòng nhập tài khoản"),
        password: z.string().min(1, "Vui lòng nhập mật khẩu"),
    })
    const { register, handleSubmit, setValue, formState: { errors }, } = useForm({ resolver: zodResolver(schema) })
    const handleLogin = async (data) => {
        const response = await login(data);
        if (response?.status != 200)
            showErrorNoti("Tài khoản hoặc mật khẩu không chính xác");
        else {
            showSuccessNoti("Đăng nhập thành công");
            navigate("/");
        }
    }
    return (
        <div className="w-full h-full flex justify-center md:items-center 2xl:px-[5%] mt-5">
            <div className="w-full max-w-[40rem] flex flex-col md:space-y-6 space-y-3 justify-start my-[5rem]">
                <h1 className=" m-auto font-bold md:text-4xl text-xl">Đăng nhập</h1>
                <div className="flex flex-col space-y-3">
                    <p className="md:text-xl space-x-2 font-bold">Tài khoản</p>
                    <input type="text"
                        className="border-2 md:h-[4rem] h-[3rem] px-4 md:text-lg"
                        placeholder="Nhập email"
                        autoComplete="off"
                        {...register("email")}
                        onChange={(e) => setValue("email", e.target.value)}
                    />
                    {errors?.email && <p className="text-[red] md:text-lg">{errors?.email.message}</p>}
                </div>
                <div className="flex flex-col space-y-3">
                    <p className="md:text-xl space-x-2 font-bold">Mật khẩu</p>
                    <div className="flex flex-row items-center justify-between relative">
                        <input type={hiddenPassword ? "password" : "text"}
                            className="w-full md:h-[4rem] h-[3rem]  px-4 border-2 md:text-lg "
                            placeholder="Nhập mật khẩu"
                            autoComplete="off"
                            {...register("password")}
                            onChange={(e) => setValue("password", e.target.value)}
                        />
                        {hiddenPassword ?
                            <FaRegEye className="w-[1.5rem] h-[1.5rem] cursor-pointer absolute right-4 text-[rgb(62,24,0)] "
                                onClick={() => setHideenPassword(!hiddenPassword)}
                            />
                            : <FaRegEyeSlash className="w-[1.5rem] h-[1.5rem] cursor-pointer absolute right-4 text-[rgb(62,24,0)] text-lg"
                                onClick={() => setHideenPassword(!hiddenPassword)}
                            />
                        }
                    </div>
                    {errors?.password && <p className="text-[red] md:text-lg">{errors?.password.message}</p>}
                </div>
                <button className="w-full bg-[rgb(62,24,0)] md:py-4 py-2 text-white md:text-lg font-bold"
                    onClick={handleSubmit(handleLogin)}>
                    Đăng nhập
                </button>
            </div>
        </div>
    )
}

export default LoginPage;