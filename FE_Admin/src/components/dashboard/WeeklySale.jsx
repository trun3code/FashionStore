import { BarChart, axisClasses } from "@mui/x-charts"
import { formatPrice } from "../../utils/format";
import money from "../../assets/no-money.webp"
import AreaView from "./AreaView"
import Legend from "./Legend";

const WeeklySale = ({ data }) => {
    // const { clothesData, shoesData, accessoriesData } = data
    const clothesData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
    const shoesData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
    const accessoriesData = [1400, 2398, 2800, 2908, 1800, 6800, 0];
    const xLabels = ['T2','T3','T4','T5','T6','T7','CN'];
    const series = [
        { data: clothesData, label: 'Quần áo', id: 'clothesId', stack: 'total', color: '#FF6347' },
        { data: shoesData, label: 'Giày', id: 'shoesId', stack: 'total', color: '#4682B4' },
        { data: accessoriesData, label: 'Phụ kiện', id: 'accesoriesId', stack: 'total', color: '#32CD32' },
    ]
    const hasData = clothesData.some(v => v !== 0) || shoesData.some(v => v !== 0) || accessoriesData.some(v => v !== 0);
    return (
        <AreaView title={"Thu nhập tuần này"}>
            {hasData
                ? <div className="-translate-y-14 transition-all relative">
                    <BarChart
                        height={300}
                        series={series.map((series) => ({
                            ...series,
                            valueFormatter: (v) => (v === null ? '' : formatPrice(v)),
                        }))}
                        xAxis={[{ data: xLabels, scaleType: 'band', categoryGapRatio: 0.7 }]}
                        yAxis={[{
                            label: "Triệu đồng",
                            valueFormatter: v => v / 1000
                        }]}
                        legend={{ hidden: true }}
                        grid={{ horizontal: true }}
                        sx={{
                            [`.${axisClasses.line}`]: {
                                display: 'none'
                            },
                            [`.${axisClasses.tick}`]: {
                                display: 'none'
                            },
                            [`.${axisClasses.left} .${axisClasses.tickLabel}`]: {
                                transform: 'translate(-5px, 0px)',
                                fontSize: "18px",
                                fontWeight: 600,
                            },
                            [`.${axisClasses.left} .${axisClasses.label}`]: {
                                transform: 'translate(-12px, 0px)',
                                fontSize: "18px",
                                fontWeight: 600,
                            },
                        }}
                    />
                    <Legend items={series} type={"row"} />
                </div>
                :<div className="w-[510px] h-full flex flex-col space-y-4">
                    <img src={money} className=" w-[450px] h-fit object-contain rounded-xl"/>
                    <p className="ml-20 text-red-500 font-black">
                        Bạn chưa có thu nhập trong tuần này 😭 
                    </p>
                </div>
            }
        </AreaView>
    )
}

export default WeeklySale
