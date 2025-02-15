import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { changePassword} from "../../api/user";
import { showErrorNoti, showSuccessNoti } from "../../utils/toastify";

const AccountPassword = () => {
    const [hiddenPassword, setHideenPassword] = useState(true);
    const [hiddenPassword1, setHideenPassword1] = useState(true);
    const schema = z.object({
        exPassword: z.string().min(1, "Vui lòng nhập mật khẩu cũ"),
        password: z.string().min(8, "Mật khẩu ít nhất bao gồm 8 kí tự")
            .regex(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$'), { message: "Mật khẩu phải bao gồm ký tự hoa, ký tự thường và số" }),
        confirm: z.string()
    }).refine(data => data.password == data.confirm, {
        message: "Mật khẩu không trùng khớp",
        path: ['password']
    })
    const { register, handleSubmit, setValue, reset, formState: { errors }, } = useForm({ resolver: zodResolver(schema) })
    const handleChangePassword = async (data) => {
        const response = await changePassword(data.exPassword, data.password);
        if (response.status == 200) {
            showSuccessNoti("Đổi mật khẩu thành công");
            reset({
                exPassword: "",
                password: "",
                confirm: ""
            })
            return;
        }
        if (response.status == 400) {
            showErrorNoti("Mật khẩu không chính xác");
            return;
        }
        showErrorNoti("Có lỗi xảy ra, vui lòng thử lại");
        reset({
            exPassword: "",
            password: "",
            confirm: ""
        })
    }
    return (
        <div className="flex flex-col space-y-6 sm:w-2/3 mx-auto">
            <div className="space-y-3">
                <p className="md:text-xl space-x-2 font-bold">Mật khẩu hiện tại <span className="text-[red]">*</span></p>
                <div className="flex flex-row items-center justify-between relative">
                    <input type={hiddenPassword ? "password" : "text"}
                        className="w-full md:h-[4rem] h-[3rem]  px-4 border-2 md:text-lg "
                        placeholder="Nhập mật khẩu"
                        {...register("exPassword")}
                        onChange={(e) => setValue("exPassword", e.target.value)} />
                    {hiddenPassword
                        ? <FaRegEye className="w-[1.5rem] h-[1.5rem] cursor-pointer absolute right-4 text-[rgb(62,24,0)] "
                            onClick={() => setHideenPassword(!hiddenPassword)} />
                        : <FaRegEyeSlash className="w-[1.5rem] h-[1.5rem] cursor-pointer absolute right-4 text-[rgb(62,24,0)] text-lg"
                            onClick={() => setHideenPassword(!hiddenPassword)} />
                    }
                </div>
                {errors?.exPassword && <p className="text-[red] md:text-lg">{errors?.exPassword.message}</p>}
            </div>

            <div className="space-y-3">
                <div className="space-y-1">
                    <p className="md:text-xl space-x-2 font-bold">Mật khẩu mới <span className="text-[red]">*</span></p>
                    <div className="flex flex-row items-center justify-between relative">
                        <input type={hiddenPassword1 ? "password" : "text"}
                            className="w-full md:h-[4rem] h-[3rem]  px-4 border-2 md:text-lg "
                            placeholder="Nhật mật khẩu mới"
                            {...register("password")}
                            onChange={(e) => setValue("password", e.target.value)}
                        />
                        {hiddenPassword1
                            ? <FaRegEye className="w-[1.5rem] h-[1.5rem] cursor-pointer absolute right-4 text-[rgb(62,24,0)] "
                                onClick={() => setHideenPassword1(!hiddenPassword1)} />
                            : <FaRegEyeSlash className="w-[1.5rem] h-[1.5rem] cursor-pointer absolute right-4 text-[rgb(62,24,0)] text-lg"
                                onClick={() => setHideenPassword1(!hiddenPassword1)} />
                        }
                    </div>
                    {errors?.password && <p className="text-[red] md:text-lg">{errors?.password.message}</p>}
                </div>
                <div className="space-y-1">
                    <p className="md:text-xl space-x-2 font-bold">Xác nhận mật khẩu <span className="text-[red]">*</span></p>
                    <div className="flex flex-row items-center justify-between relative">
                        <input type={hiddenPassword1 ? "password" : "text"}
                            className="w-full md:h-[4rem] h-[3rem]  px-4 border-2 md:text-lg "
                            placeholder="Nhập mật khẩu xác nhận"
                            {...register("confirm")}
                            onChange={(e) => setValue("confirm", e.target.value)} />
                    </div>
                    {errors?.confirm && <p className="text-[red] md:text-lg">{errors?.confirm.message}</p>}
                </div>
            </div>
            <button className="m-auto px-[1rem] bg-[rgb(62,24,0)] sm:py-4 py-3 text-white md:text-lg font-bold"
                onClick={handleSubmit(handleChangePassword)}>
                Đổi mật khẩu
            </button>
        </div>
    )
}
export default AccountPassword;
