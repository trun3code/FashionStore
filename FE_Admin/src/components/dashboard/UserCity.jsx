import { PieChart } from "@mui/x-charts";
import AreaView from "./AreaView";
import Legend from "./Legend";

const UserCity = ({ value }) => {
    const data = [
        { value: value ? value[0] : 0.4, label: 'Hà Nội', color: 'rgb(24, 119, 242)' },
        { value: value ? value[1] : 0.6, label: 'Các tỉnh khác', color: 'rgb(255, 86, 48)' },
    ]
    return (
        <AreaView title={"Vị trí đặt hàng"}>
            <div className="-translate-y-8 flex m-auto">
                <PieChart
                    series={[
                        {
                            data: data,
                            innerRadius: value?.others == 0 ? 0 : 1,
                            outerRadius: 75,
                            paddingAngle: value?.others == 0 ? 0 : 1,
                        },
                    ]}
                    width={250}
                    height={250}
                    legend={{ hidden: true }}
                />
                <div className="m-auto">
                    <Legend items={data} type={"col"} />
                </div>
            </div>
        </AreaView>
    )
}

export default UserCity;
