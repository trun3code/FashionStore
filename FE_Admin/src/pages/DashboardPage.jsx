import { useEffect, useState } from "react";
import { getDashboardData } from "../api/dashboard";
import UserCity from "../components/dashboard/UserCity";
import Overview from "../components/dashboard/Overview";
import TopProduct from "../components/dashboard/TopProduct";
import DateFilter from "../components/dashboard/DateFilter";
// import HotCategory from "../components/dashboard/HotCategory";
// import WeeklySale from "../components/dashboard/WeeklySale";
// import MonthGoal from "../components/dashboard/MonthlyGoal";

const DashboardPage = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [data, setData] = useState(null);
    async function fetchData() {
        setData(await getDashboardData(startDate, endDate));
    }
    useEffect(() => {
        fetchData();
    }, [startDate, endDate])
    return (
        <>{data != null &&
            <div className="max-w-screen-2xl flex justify-center mt-[5rem] mx-auto">
                <div className="flex flex-col w-full justify-start space-y-8 p-4 m-auto">
                    <div className="w-[80%] mx-auto">
                        <DateFilter setStartDate={setStartDate} setEndDate={setEndDate} />
                        <Overview data={data?.overview} />
                    </div>
                    <div className="flex w-full flex-row space-x-8 justify-center m-auto">
                        <div className="flex flex-row space-x-10">
                            <TopProduct products={data?.topProducts} />
                            <UserCity value={data?.userCity} />
                        </div>
                    </div>
                    {/* <WeeklySale data={data?.weeklySale} /> */}
                    {/* <MonthGoal value={data?.monthlyGoal} /> */}
                    {/* <HotCategory data={data?.hotCategory} /> */}
                </div>
            </div>
        }</>
    )
}

export default DashboardPage;
