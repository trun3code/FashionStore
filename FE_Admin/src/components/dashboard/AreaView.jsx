const AreaView = ({ title, children }) => {
    return (
        <div className="w-full h-full bg-white px-6 pt-5 rounded-2xl border space-y-6">
            <h2 className="font-black text-xl text-center">{title}</h2>
            <div className="m-auto">
                {children}
            </div>
        </div>
    )
}
export default AreaView;
