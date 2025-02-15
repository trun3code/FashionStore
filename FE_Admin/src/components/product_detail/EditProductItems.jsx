import { useState, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { MdClear, MdDelete, MdDone, MdEdit } from 'react-icons/md';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProductItem, removeProductItem, createProductItem } from '../../api/product';
import Modal from "../../layouts/Modal";
import UploadAndDisplayImage from '../../layouts/UploadAndDisplayImage';

const Item = ({ item, removeInList, updateInList }) => {
    const { id } = useParams();
    const [image, setImage] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [canEdit, setCanEdit] = useState(item ? false : true)
    const schema = z.object({
        bonusPrice: z.number().min(0, "Bắt buộc"),
        color: z.string(),
        size: z.union([z.string().min(1, "Bắt buộc"), z.number().min(1, "Bắt buộc")]),
        quantity: z.number().min(1, "Bắt buộc")
    });
    const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            color: item?.color,
            size: item?.size,
            quantity: item?.quantity || 1,
            bonusPrice: item?.bonusPrice || 0,
            image: item?.productImage,
        }
    })
    const cancelEdit = () => {
        setCanEdit(false);
        if (item) reset();
        else removeItem();
    }
    const startEdit = () => {
        setCanEdit(true);
    }
    const endEdit = async (data) => {
        data['id'] = item?.id || 0;
        if (data.id == 0) data = await createProductItem(data, image, id);
        else await updateProductItem(data, image, id);
        updateInList(data);
        setCanEdit(false);
    }
    const removeItem = async () => {
        if (item?.id) await removeProductItem(item.id);
        removeInList();
    }
    return (
        <tr className="bg-white hover:bg-[rgb(249,250,251)] text-[16px] relative">
            <td className="w-[15%] font-medium text-center">
                <UploadAndDisplayImage size={4} curImage={image} setImage={setImage} originalImage={watch("image")} canEdit={canEdit} />
            </td>
            <td className="w-[20%] text-center font-medium space-y-2">
                <input type="number" required className={`w-[6rem] text-center p-2
                    border-gray-300 outline-[rgba(24,119,242,0.3)] rounded-md
                    ${canEdit ? "border" : "bg-transparent"}`}
                    disabled={!canEdit}
                    {...register("bonusPrice", {
                        setValueAs: (value) => Number(value)
                    })}
                    onChange={(e) => { setValue("bonusPrice", e.target.value); }}
                />
                {errors?.bonusPrice && <p className="text-red-500 text-[14px]">{errors?.bonusPrice?.message}</p>}
            </td>
            <td className="font-medium w-[15%] space-y-2">
                <div className='rounded-full mx-auto w-[2.5rem] h-[2.5rem] 
                overflow-hidden flex items-center justify-center shadow-lg'>
                    <input
                        type="color" required
                        disabled={!canEdit}
                        className='w-[2.5rem] h-[2.5rem] rounded-md
                        border-none outline-none cursor-pointer'
                        {...register("color")}
                        onChange={(e) => setValue("color", e.target.value)}
                    />
                </div>
                {errors?.color && <p className="text-red-500 text-[14px]">{errors?.color?.message}</p>}
            </td>
            <td className="font-medium w-[15%] text-center space-y-2">
                <input type="text" placeholder='S,M,L,XL,XXL,XXXL,...' required className={`w-[5rem] p-2 text-center 
                    border-gray-300 outline-[rgba(24,119,242,0.3)] rounded-md ${canEdit ? "border" : "bg-transparent"}`}
                    disabled={!canEdit}
                    {...register("size")}
                    onChange={(e) => setValue("size", e.target.value)}
                />
                {errors?.size && <p className="text-red-500 text-[14px]">{errors?.size?.message}</p>}
            </td>
            <td className="font-medium w-[15%] text-center">
                <input type="number" required className={`w-[4rem] p-2 text-center
                    border-gray-300 outline-[rgba(24,119,242,0.3)] rounded-md ${canEdit ? "border" : "bg-transparent"}`}
                    disabled={!canEdit}
                    {...register("quantity", {
                        setValueAs: (value) => Number(value)
                    })}
                    onChange={(e) => setValue("quantity", e.target.value)}
                />
                {errors?.quantity && <p className="text-red-500 text-[14px]">{errors?.quantity?.message}</p>}
            </td>
            <td className="font-medium w-[15%]">
                <div className='flex flex-row justify-center items-center space-x-2'>
                    {canEdit
                        ? (
                            <>
                                <div className="bg-[rgba(24,119,242,0.3)] p-2 rounded-[50%] cursor-pointer" onClick={handleSubmit(endEdit)}>
                                    <MdDone className="w-[1.2rem] h-[1.2rem] text-[rgb(24,119,242)]" />
                                </div>
                                <div className="bg-[rgba(255,86,48,0.3)] p-2 rounded-[50%] cursor-pointer" onClick={cancelEdit}>
                                    <MdClear className="w-[1.2rem] h-[1.2rem] text-[rgb(255,86,48)]" />
                                </div>
                            </>
                        )
                        : (
                            <>
                                <div className="bg-[rgba(24,119,242,0.3)] p-2 rounded-[50%] cursor-pointer" onClick={startEdit}>
                                    <MdEdit className="w-[1.2rem] h-[1.2rem] text-[rgb(24,119,242)]" />
                                </div>
                                <div className="bg-[rgba(255,86,48,0.3)] p-2 rounded-[50%] cursor-pointer" onClick={() => setOpenModal(true)}>
                                    <MdDelete className="w-[1.2rem] h-[1.2rem] text-[rgb(255,86,48)]" />
                                </div>
                            </>
                        )
                    }
                </div>
            </td>
            <td>
                <Modal open={openModal} onClose={() => setOpenModal(false)}>
                    <div className="w-56 h-full flex justify-center items-center flex-col space-y-2">
                        <MdDelete className="w-[3rem] h-[3rem] text-[rgb(255,86,48)]" />
                        <h3 className="text-lg font-black text-gray-800">Xóa sản phẩm</h3>
                        <p className="text-[12px] text-center text-gray-500">
                            Bạn có chắc là muốn xóa?
                        </p>
                        <div className="flex gap-2 w-full">
                            <button className="py-2 px-4 b bg-[rgb(246,246,246)] 
                                text-red-500 font-semibold w-1/2 text-center rounded-xl shadow" onClick={removeItem}>
                                Xóa
                            </button>
                            <button className="py-2 px-4 bg-[rgb(36,212,212)] 
                                text-white font-semibold w-1/2 text-center rounded-xl shadow" onClick={() => setOpenModal(false)}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </Modal>
            </td>
        </tr >
    );
}
const EditProductItems = ({ productItems }) => {
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    return (
        <div className='flex flex-col w-full justify-start space-y-6 bg-white p-12 rounded-md shadow-lg'>
            <div className='flex'>
                <p className="text-lg w-full text-center font-black">Biến thể sản phẩm</p>
                <button type='button' className=' text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg 
                        text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 'onClick={() => {
                        if (productItems.length == 0 || productItems[productItems.length - 1]) {
                            productItems.push(null);
                            forceUpdate();
                        }
                        window.scrollTo(0, document.body.scrollHeight);
                    }}>
                    <span className='text-[14px]'>Thêm</span>
                </button>
            </div>
            <table className="table-auto w-full">
                <thead className="h-[50px] text-[#637381]">
                    <tr>
                        <th className="w-[15%] text-center font-medium">Hình ảnh</th>
                        <th className="w-[20%] text-center font-medium">Giá trả thêm</th>
                        <th className="font-medium w-[15%] text-center">Màu sắc</th>
                        <th className="font-medium w-[15%] text-center">Kích thước</th>
                        <th className="font-medium w-[15%] text-center">Trong kho</th>
                        <th className="font-medium w-[15%] text-center">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="h-0">
                    {productItems?.map((item, index) => (
                        <Item
                            key={item?.id || -index}
                            item={item}
                            removeInList={() => {
                                productItems.splice(index, 1);
                                forceUpdate();
                            }}
                            updateInList={(item) => { productItems[index] = item; }}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default EditProductItems;
