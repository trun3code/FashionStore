import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { showErrorNoti, showSuccessNoti } from "../../utils/toastify";
import { updateUser } from "../../api/user";
// import AccountAvatar from "./AccountAvatar";

const AccountPersonal = ({ data }) => {
    const [image, setImage] = useState(null);
    const schema = z.object({
        name: z.string().min(2, "Độ dài tên cần từ 2 kí tự trở lên"),
        phoneNumber: z.string().min(10, "Số điện thoại không hợp lệ").max(11, "Số điện thoại không hợp lệ"),
        gender: z.string().min(1, "Vui lòng chọn giới tính"),
    })
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
    useEffect(() => {
        setValue("name", data.name);
        setValue("gender", data.gender);
        setValue("phoneNumber", data.phoneNumber);
    }, [data]);
    const handleUpdate = async (user) => {
        user.avatar = data.avatar;
        user.id = data.id;
        const response = await updateUser(user, image);
        if (response.status == 200) {
            data.name = response.data.name;
            data.gender = response.data.gender;
            data.phoneNumber = response.data.phoneNumber;
            data.avatar = response.data.avatar;
            showSuccessNoti("Cập nhật thông tin người dùng thành công");
        }
        else showErrorNoti("Cập nhật thông tin thất bại")
    }
    return (
        <div className="space-y-6 px-[1rem] w-[75%] mx-auto">
            <div className="flex flex-row w-full">
                <div className="w-full mr-[1rem]">
                    <div className="flex flex-col space-y-3">
                        <p className="md:text-xl space-x-2 font-bold">Email/Tài khoản</p>
                        <input type="text" className="border-2 md:h-[4rem] h-[3rem] px-4 md:text-lg cursor-not-allowed" disabled defaultValue={data?.email || ''} />
                    </div>
                    <div className="flex flex-col space-y-3">
                        <p className="md:text-xl space-x-2 font-bold">Tên người dùng <span className="text-[red]">*</span></p>
                        <input type="text" className="border-2 md:h-[4rem] h-[3rem] px-4 md:text-lg"
                            placeholder="Nhập tên"
                            {...register("name")}
                            onChange={(e) => setValue("name", e.target.value)} />
                        {errors?.name && <p className="text-[red] md:text-lg">{errors?.name.message}</p>}
                    </div>
                </div>
                <div className="m-auto">
                    {/* <AccountAvatar defaultImage={data?.avatar} image={image} setImage={setImage} /> */}
                </div>
            </div>
            <div className="flex md:flex-row flex-col justify-between w-full ">
                <div className="flex flex-col space-y-3 w-[60%]">
                    <p className="md:text-xl space-x-2 font-bold">Số điện thoại<span className="text-[red]">*</span></p>
                    <input type="text" className="border-2 md:h-[4rem] h-[3rem] px-4 md:text-lg"
                        placeholder="Nhập số điện thoại"
                        {...register("phoneNumber")}
                        onChange={(e) => setValue("phoneNumber", e.target.value)} />
                    {errors?.phoneNumber && <p className="text-[red] md:text-lg">{errors?.phoneNumber.message}</p>}
                </div>
                <div className="flex flex-col space-y-3 w-[35%]">
                    <p className="md:text-xl space-x-2 font-bold">Giới tính <span className="text-[red]">*</span></p>
                    <select className="border-2 md:h-[4rem] h-[3rem] px-4 md:text-lg opacity-60"
                        {...register("gender")}
                        onChange={(e) => setValue("gender", e.target.value)}>
                        <option value="0">Nam</option>
                        <option value="1">Nữ</option>
                    </select>
                    {errors?.gender && <p className="text-[red] md:text-lg">{errors?.gender.message}</p>}
                </div>
            </div>
            <div className="flex">
                <button className="md:w-[15rem] mx-auto w-full bg-[rgb(62,24,0)] sm:py-4 py-3 text-white md:text-lg font-bold"
                    onClick={handleSubmit(handleUpdate)}>
                    Cập nhật thông tin
                </button>
            </div>
        </div>
    )
}

export default AccountPersonal;