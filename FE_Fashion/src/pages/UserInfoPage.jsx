import { useState, memo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signup } from "../api/user";
import { showErrorNoti, showSuccessNoti } from "../utils/toastify";
import { useNavigate } from "react-router-dom";
import UploadAndDisplayImage from "../components/account/UploadAndDisplayImage";

const UserInfoPage = ({ setNextStepSignup, data }) => {
    const { t } = useTranslation("global");
    const navigate = useNavigate();
    const schema = z.object({
        name: z.string().trim().min(2, t("signup.name-err")),
        phoneNumber: z.string().min(10, t("profile.phone-err")).max(11, t("profile.phone-err")),
        gender: z.string().min(1, t("profile.gender-err")),
    })
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });
    const [image, setImage] = useState(null);
    const handleSignup = async (user) => {
        data.user = user;
        const response = await signup(data, image);
        if (response.status == 200) {
            showSuccessNoti(t("signup-success"));
            navigate("/account");
        }
        else {
            showErrorNoti(t("signup-err"));
            handleReturn();
        }
    }
    const handleReturn = () => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        setNextStepSignup(false);
    }
    return (
        <div className="w-full h-full flex justify-center md:items-center 2xl:px-[5%]">
            <div className="w-full max-w-[40rem] flex flex-col md:space-y-6 space-y-3 justify-start my-[5rem]">
                <h1 className=" m-auto font-bold md:text-4xl text-xl">{t("profile.title")}</h1>
                <div className="flex flex-col space-y-3">
                    <p className="md:text-xl space-x-2 font-bold">{t("profile.photo")}</p>
                    <UploadAndDisplayImage image={image} setImage={setImage} />
                </div>
                <div className="flex flex-col space-y-3">
                    <p className="md:text-xl space-x-2 font-bold">{t("signup.name")} <span className="text-[red]">*</span></p>
                    <input type="text"
                        className="border-2 md:h-[4rem] h-[3rem] px-4 md:text-lg"
                        placeholder={t("signup.name-ex")}
                        {...register("name")}
                        onChange={(e) => setValue("name", e.target.value)} />
                    {errors?.name && <p className="text-[red] md:text-lg">{errors?.name.message}</p>}
                </div>
                <div className="flex flex-col space-y-3">
                    <p className="md:text-xl space-x-2 font-bold">{t("profile.phone")} <span className="text-[red]">*</span></p>
                    <input type="text"
                        className="border-2 md:h-[4rem] h-[3rem] px-4 md:text-lg"
                        placeholder={t("profile.phone-ex")}
                        {...register("phoneNumber")}
                        onChange={(e) => setValue("phoneNumber", e.target.value)} />
                    {errors?.phoneNumber && <p className="text-[red] md:text-lg">{errors?.phoneNumber.message}</p>}
                </div>
                <div className="flex flex-col space-y-3">
                    <p className="md:text-xl space-x-2 font-bold">{t("profile.gender")} <span className="text-[red]">*</span></p>
                    <select className="border-2 md:h-[4rem] h-[3rem] px-4 md:text-lg opacity-60"
                        {...register("gender")}
                        onChange={(e) => setValue("gender", e.target.value)}>
                        <option value="">{t("profile.gender-ex")}</option>
                        <option value="0">{t("profile.male")}</option>
                        <option value="1">{t("profile.female")}</option>
                    </select>
                    {errors?.gender && <p className="text-[red] md:text-lg">{errors?.gender.message}</p>}
                </div>
                <button className="w-full bg-[rgb(62,24,0)] md:py-4 py-2 text-white md:text-lg font-bold" onClick={handleSubmit(handleSignup)}>
                    {t('profile.button')}
                </button>
                <p className="underline cursor-pointer text-[rgb(62,24,0)] md:text-lg font-bold w-full text-center" onClick={handleReturn} >{t("signup.prev")}</p>
            </div>
        </div>
    )
}

export default memo(UserInfoPage);