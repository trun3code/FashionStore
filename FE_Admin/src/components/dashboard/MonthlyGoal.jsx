import { GaugeContainer, GaugeValueArc, GaugeReferenceArc, useGaugeState } from '@mui/x-charts/Gauge';
import AreaView from './AreaView';

const GaugePointer = () => {
    const { valueAngle, outerRadius, cx, cy } = useGaugeState();
    const target = {
        x: cx + outerRadius * Math.sin(valueAngle),
        y: cy - outerRadius * Math.cos(valueAngle),
    };
    return valueAngle === null ? null : (
        <g>
            <circle cx={cx} cy={cy} r={5} fill="red" />
            <path d={`M ${cx} ${cy} L ${target.x} ${target.y}`} stroke="red" strokeWidth={3} />
        </g>
    );
}

const MonthGoal = ({ value }) => {
    return (
        <AreaView title={"Tiến độ tháng"}>
            <div className="w-full overflow-hidden">
                <GaugeContainer 
                    value={value}
                    width={150}
                    height={150}
                    startAngle={-110}
                    endAngle={110}
                >
                    <GaugeReferenceArc />
                    <GaugeValueArc />
                    <GaugePointer />
                </GaugeContainer>
                <div className="h-full bottom-0 w-full flex justify-center items-end">
                    <p className="text-xl font-semibold">{value}%</p>
                </div>
            </div>
        </AreaView>
    );
}

export default MonthGoal;
