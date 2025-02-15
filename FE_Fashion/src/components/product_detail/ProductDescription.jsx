const ProductDescription = ({ description }) => {
    const sentences = description?.split('.').filter(sentence => sentence.trim() !== '');
    return (
        <div className="space-y-4 lg:mx-[15rem]">
            {sentences?.map((sentence, index) => (
                <p key={index} className="text-black md:text-xl capitalize">
                    {sentence.trim()}.
                </p>
            ))}
        </div>
    );
}
export default ProductDescription;