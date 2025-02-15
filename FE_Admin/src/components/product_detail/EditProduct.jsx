import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { showSuccessNoti } from '../../utils/toastify';
import { updateProduct, createProduct } from '../../api/product';
import UploadAndDisplayImage from '../../layouts/UploadAndDisplayImage';

const EditProduct = ({ product, setProduct }) => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const schema = z.object({
        productName: z.string().min(1, "Tên sản phẩm không được để trống!"),
        price: z.number().min(1, "Giá sản phẩm phải lớn hơn 0!"),
        description: z.string(),
        sale: z.number().min(0, "Giảm giá không được nhỏ hơn 0").max(100, "Giảm giá không được lớn hơn 100"),
        productImage: z.string(),
        category: z.object({
            gender: z.string(),
            brand: z.string(),
            category: z.string()
        }),
    });
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
    useEffect(() => {
        setValue("productName", product?.productName);
        setValue("productImage", product?.productImage || "");
        setValue("sale", product?.sale);
        setValue("price", product?.price);
        setValue("description", product?.description);
        setValue("category", product?.category);
    }, [product]);
    const handleEditProduct = async (data) => {
        data.id = product?.id || 0;
        if (data.id == 0) data = (await createProduct(data, image));
        else data = (await updateProduct(data, image));
        setImage(null);
        showSuccessNoti("Cập nhật sản phẩm thành công!");
        navigate("/product/edit/" + data.id);
        setProduct(data);
    }
    return (
        <div className="flex flex-col w-full justify-start space-y-6 bg-white p-12 rounded-md shadow-lg">
            <div className='space-y-1 text-start'>
                <div className="flex flex-row items-center space-x-1">
                    <label className="w-[6.5rem] text-gray-600 font-semibold">Tên sản phẩm:</label>
                    <input type="text" placeholder='Nhập tên sản phẩm tại đây ...'
                        className="flex-grow  py-2 px-4 border border-gray-300 outline-[rgba(24,119,242,0.3)] rounded-md"
                        {...register("productName")}
                        onChange={(e) => setValue("productName", e.target.value)}
                    />
                </div>
                {errors?.productName && <p className="text-red-500 text-[14px]">{errors.productName?.message}</p>}
            </div>
            <div className="w-[12.5rem] h-[12.5rem]">
                <label className="w-[6.5rem] text-gray-600 font-semibold">Hình ảnh:</label>
                <UploadAndDisplayImage size={10} originalImage={watch("productImage")} curImage={image} setImage={setImage} />
            </div>
            <div className=' text-start flex flex-row mt-0'>
                <div className='flex flex-col w-full my-auto'>
                    <div className='text-start'>
                        <div className="flex flex-row w-full items-center space-x-1  space-y-4">
                            <label className="w-[6.5rem] text-gray-600 font-semibold">Giá hiển thị:</label>
                            <input type="number" placeholder='Nhập giá (nghìn đồng)'
                                className="font-bold py-2 px-4 border border-gray-300 outline-[rgba(24,119,242,0.3)] rounded-md"
                                {...register("price", {
                                    setValueAs: (value) => parseInt(value)
                                })}
                                onChange={(e) => setValue("price", e.target.value)}
                            />
                        </div>
                        {errors?.price && <p className="text-red-500 text-[14px]">{errors?.price?.message}</p>}
                    </div>
                    <div className='text-start'>
                        <div className="flex flex-row w-full items-center space-x-1  space-y-4">
                            <label className=" w-[6.5rem] text-gray-600 font-semibold">Giảm giá (%):</label>
                            <input type="number" placeholder='Giảm (%)'
                                className="font-bold py-2 px-4 border border-gray-300 outline-[rgba(24,119,242,0.3)] rounded-md"
                                {...register("sale", {
                                    setValueAs: (value) => parseInt(value)
                                })}
                                onChange={(e) => setValue("sale", e.target.value)}
                            />
                        </div>
                        {errors?.sale && <p className="text-red-500 text-[14px]">{errors?.sale?.message}</p>}
                    </div>
                </div>
                <div className='w-1/2 flex flex-row items-center justify-evenly '>
                    <p className="w-[6rem] text-gray-600 font-semibold">Danh mục</p>
                    <div className='flex flex-col space-y-4'>
                        <div className='flex flex-row space-x-2 items-center'>
                            <label className="w-[5rem] text-gray-600 font-semibold">
                                Giới tính:
                            </label>
                            <select
                                className="border font-bold border-gray-300 outline-[rgba(24,119,242,0.3)] 
                                    rounded-md px-4 py-2 w-[8rem]"
                                {...register("category.gender")}
                                onChange={(e) => setValue("category.gender", e.target.value)}
                            >
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                                <option value="kid">Trẻ em</option>
                            </select>
                        </div>
                        <div className='flex flex-row space-x-2 items-center'>
                            <label className="w-[5rem] text-gray-600 font-semibold">
                                Phân loại:
                            </label>
                            <select
                                className="border font-bold border-gray-300 outline-[rgba(24,119,242,0.3)] 
                                    rounded-md px-4 py-2 w-[8rem]"
                                {...register("category.category")}
                                onChange={(e) => setValue("category.category", e.target.value)}
                            >
                                <option value="shoes">Giày</option>
                                <option value="clothes">Quần áo</option>
                                <option value="accessories">Phụ kiện</option>
                            </select>
                        </div>
                        <div className='flex flex-row space-x-2 items-center'>
                            <label className="w-[5rem] text-gray-600 font-semibold">
                                Nhãn hiệu:
                            </label>
                            <select
                                className="border font-bold border-gray-300 outline-[rgba(24,119,242,0.3)] 
                                    rounded-md px-4 py-2 w-[8rem]"
                                {...register("category.brand")}
                                onChange={(e) => setValue("category.brand", e.target.value)}
                            >
                                <option value="nike">Nike</option>
                                <option value="adidas">Adidas</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className='space-y-1 text-start'>
                <div className="flex flex-row w-full items-center space-x-1">
                    <label className="w-[6.5rem] text-gray-600 font-semibold">Mô tả:</label>
                    <textarea placeholder='Nhập mô tả sản phẩm ... (Tối thiểu 5 kí tự)'
                        rows={5}
                        className="flex-grow py-2 px-4 border border-gray-300 outline-[rgba(24,119,242,0.3)] rounded-md"
                        {...register("description")}
                        onChange={(e) => setValue("description", e.target.value)}
                    />
                </div>
                {errors?.description && <p className="text-red-500 text-[14px]">{errors?.description?.message}</p>}
            </div>
            <button className='bg-[rgb(33,43,54)] text-white w-[14rem] font-bold rounded-md p-4 mx-auto'
                onClick={handleSubmit(handleEditProduct, (errors) => console.error(errors))}>
                Cập nhật
            </button>
        </div>
    );
}

export default EditProduct;
