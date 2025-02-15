const Legend = ({ items, type }) => {
    return (
        <div className={`flex ${type == "row" ? "flex-row justify-center space-x-4 -translate-y-5" : "flex-col space-y-8"}`}>
            {items.map((item, index) => (
                <div key={index} className="flex flex-row space-x-2 items-center">
                    <div className="w-[14px] h-[14px] rounded-[50%]"
                        style={{
                            backgroundColor: item?.color,
                        }}></div>
                    <span className="font-medium text-sm">{item?.label}</span>
                </div>
            ))}
        </div>
    );
};

export default Legend;
