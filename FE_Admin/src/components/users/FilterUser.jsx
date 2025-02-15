import { useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import Modal from "../../layouts/Modal";

const FilterUser = ({ users, setUsers }) => {
    const [showSort, setShowSort] = useState(false);
    const [sortIndex, setSortIndex] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const values = [
        {
            value: "newest",
            title: "Mới nhất"
        },
        {
            value: "oldest",
            title: "Cũ nhất"
        },
        {
            value: "alphabet",
            title: "Từ A-Z"
        },
        {
            value: "non-alphabet",
            title: "Từ Z-A"
        }
    ]
    const handleSort = (value, event) => {
        event.stopPropagation();
        setSortIndex(value);
        setShowSort(false);
    }
    useEffect(() => {
        if(!users) return;
        const sortType = values[sortIndex].value;
        sortType == "newest"
            ? users.sort((a, b) => new Date(b.createAt) - new Date(a.createAt))
            : sortType == "oldest"
                ? users.sort((a, b) => new Date(a.createAt) - new Date(b.createAt))
                : sortType == "alphabet"
                    ? users.sort((a, b) => {
                        const nameA = a.name?.toLowerCase();
                        const nameB = b.name?.toLowerCase();
                        return nameA.localeCompare(nameB);
                    })
                    : users.sort((a, b) => {
                        const nameA = a.name?.toLowerCase();
                        const nameB = b.name?.toLowerCase();
                        return nameB.localeCompare(nameA);
                    });
        setUsers([...users]);
    }, [sortIndex])
    return (
        <div className="w-full p-6 bg-white flex flex-row justify-between rounded-t-[16px] items-center">
            <div className="flex flex-row items-center space-x-6 w-[75%]">
                <div className="space-x-2 flex flex-row items-center">
                    <label className="font-medium">Sắp xếp theo:</label>
                    <div className={`cursor-pointer text-[#637381] py-2 px-3 rounded-[8px] justify-around w-[14rem] flex flex-row items-center relative 
                        ${showSort ? "border-[rgb(24,119,242)] border-[1px] pointer-events-none" : "border-[1px]"}`}
                        onClick={() => { setShowSort(true); }}>
                        <span>{values[sortIndex].title}</span>
                        <MdKeyboardArrowDown />
                        {showSort &&
                            <ul className={`list-none absolute bg-white shadow-xl top-[41px] rounded-[8px]
                                transform transition-all duration-300 ease-in-out ${showSort && "pointer-events-auto"}`}>
                                {values?.map((value, index) => (
                                    <li key={index}
                                        className={`py-2 px-5 w-[14rem] first:rounded-t-[8px] last-rounded-b-[8px]
                                        ${index == sortIndex ? "bg-[rgb(237,244,254)]" : "hover:bg-[rgb(245,245,245)]"}`}
                                        onClick={(event) => handleSort(index, event)}
                                        value={value.value}>
                                        {value.title}
                                    </li>
                                ))}
                            </ul>
                        }
                    </div>
                </div>
            </div>
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
            </Modal>
        </div>
    );
}

export default FilterUser;