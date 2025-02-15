import { useState, useEffect } from "react";
import { getFullUser, searchUser } from "../api/user";
import FilterUser from "../components/users/FilterUser";
import ListUser from "../components/users/ListUser";
import SearchBar from "../layouts/SearchBar";

const UserPage = () => {
    const [users, setUsers] = useState([]);
    async function fetchData() {
        setUsers(await getFullUser());
    }
    useEffect(() => {
        fetchData();
    }, [])
    return (
        <>
            <SearchBar getData={searchUser} setData={setUsers} />
            <div className="max-w-screen-xl w-full space-y-8 m-auto">
                <p className="text-center font-bold text-2xl">Danh sách người dùng</p>
                <div>
                    <FilterUser users={users} setUsers={setUsers} />
                    <ListUser users={users} setUsers={setUsers} />
                </div>
            </div>
        </>
    )
}

export default UserPage;