import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { changePassword} from "../../api/user";
import { showErrorNoti, showSuccessNoti } from "../../utils/toastify";

const AccountPassword = () => {
    const { t } = useTranslation("global");
    const [hiddenPassword, setHideenPassword] = useState(true);
    const [hiddenPassword1, setHideenPassword1] = useState(true);
    const schema = z.object({
        exPassword: z.string().min(1, t("login.password-len-err")),
        password: z.string().min(8, t("login.password-err"))
            .regex(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$'), { message: t("login.password-err") }),
        confirm: z.string()
    }).refine(data => data.password == data.confirm, {
        message: t("signup.same"),
        path: ['password']
    })
    const { register, handleSubmit, setValue, reset, formState: { errors }, } = useForm({ resolver: zodResolver(schema) })
    const handleChangePassword = async (data) => {
        const response = await changePassword(data.exPassword, data.password);
        if (response.status == 200) {
            showSuccessNoti(t("login.password-update-success"));
            reset({
                exPassword: "",
                password: "",
                confirm: ""
            })
            return;
        }
        if (response.status == 400) {
            showErrorNoti(t("login.password-wrong"));
            return;
        }
        showErrorNoti(t("login.password-update-err"));
        reset({
            exPassword: "",
            password: "",
            confirm: ""
        })
    }
    return (
        <div className="flex flex-col space-y-6 sm:w-2/3 mx-auto">
            <div className="space-y-3">
                <p className="md:text-xl space-x-2 font-bold">{t("account.psw.current")} <span className="text-[red]">*</span></p>
                <div className="flex flex-row items-center justify-between relative">
                    <input type={hiddenPassword ? "password" : "text"}
                        className="w-full md:h-[4rem] h-[3rem]  px-4 border-2 md:text-lg "
                        placeholder={t("login.password-ex")}
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
                    <p className="md:text-xl space-x-2 font-bold">{t("account.psw.new")} <span className="text-[red]">*</span></p>
                    <div className="flex flex-row items-center justify-between relative">
                        <input type={hiddenPassword1 ? "password" : "text"}
                            className="w-full md:h-[4rem] h-[3rem]  px-4 border-2 md:text-lg "
                            placeholder={t("login.password-ex")}
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
                    <p className="md:text-xl space-x-2 font-bold">{t("account.psw.confirm")} <span className="text-[red]">*</span></p>
                    <div className="flex flex-row items-center justify-between relative">
                        <input type={hiddenPassword1 ? "password" : "text"}
                            className="w-full md:h-[4rem] h-[3rem]  px-4 border-2 md:text-lg "
                            placeholder={t("login.password-ex")}
                            {...register("confirm")}
                            onChange={(e) => setValue("confirm", e.target.value)} />
                    </div>
                    {errors?.confirm && <p className="text-[red] md:text-lg">{errors?.confirm.message}</p>}
                </div>
            </div>
            <button className="m-auto px-[1rem] bg-[rgb(62,24,0)] sm:py-4 py-3 text-white md:text-lg font-bold"
                onClick={handleSubmit(handleChangePassword)}>
                {t('account.psw.btn')}
            </button>
        </div>
    )
}
export default AccountPassword;
