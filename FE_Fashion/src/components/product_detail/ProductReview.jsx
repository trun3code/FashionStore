import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { fortmatFullDate } from "../../utils/format"
import { showErrorNoti, showSuccessNoti } from "../../utils/toastify";
import { createReview } from "../../api/product";
import { useNavigate } from "react-router-dom";
import { getAvatar, getUserId, isLogin } from "../../api/user";
import { checkBuyProduct } from "../../api/order";
import img from "../../assets/comment.png";
import noAvatar from "../../assets/ic_user.svg";

const CreateComment = ({ productId }) => {
    const [isBuy, setIsBuy] = useState(false);
    async function fetchData() {
        setIsBuy(await checkBuyProduct(getUserId(), productId));
    }
    useEffect(() => {
        fetchData();
    }, [])
    const { t } = useTranslation("global");
    const navigate = useNavigate();
    const [star, setStar] = useState(0);
    const [cmt, setCmt] = useState("");
    const handleComment = async () => {
        if (star == 0 || cmt.length < 10) {
            showErrorNoti(t("product.rating.error") + ", " + t("review.comment-err"));
            return;
        }
        showSuccessNoti(t("product.rating.success"));
        const review = { "rating": star, "comment": cmt, "productId": productId, "user": { "id": getUserId() } };
        await createReview(review);
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        navigate(0);
    }
    return (
        isBuy ?
            <div className="w-full flex flex-col justify-center items-center  border-b-2 border-b-[rgb(230,230,230)]">
                <h2 className="lg:text-3xl sm:text-2xl text-xl pb-3 font-bold text-center">{t("account.order.review")}</h2>
                <div className="w-full lg:flex lg:flex-row block  justify-center ">
                    <div className="flex flex-row mx-auto space-x-2 lg:w-[20%]">
                        {[...Array(5)].map((_, ind) =>
                        (ind < star
                            ? <FaStar key={ind} className="h-6 w-6 text-[rgb(244,189,98)]" onClick={() => setStar(ind + 1)} />
                            : <FaRegStar key={ind} className="h-6 w-6 text-[rgb(244,189,98)]" onClick={() => setStar(ind + 1)} />
                        ))}
                        <p className="text-xl font-medium">{star}</p>
                    </div>
                    <textarea rows={7} className="mx-auto p-5 lg:w-[80%] w-full border border-gray-300 outline-[rgba(24,119,242,0.3)] rounded-md"
                        onChange={(e) => setCmt(e.target.value)} />
                </div>
                <button className="mx-auto my-5 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                    onClick={handleComment}>
                    {t("product.comment")}
                </button>
            </div>
            : <div className="w-full text-center text-red-500  border-b-2 border-b-[rgb(230,230,230)] py-5 text-xl font-bold">
                {t("review.not-buy")}
            </div>
    );
}
const UserComment = ({ userReview }) => {
    const { t } = useTranslation("global");
    return (
        <>
            <div className="lg:w-[80%] w-full mx-auto justify-center items-center  border-b-2 border-b-[rgb(230,230,230)]">
                <h2 className="lg:text-3xl sm:text-2xl text-xl pb-3 font-bold text-center">
                    {t("account.order.user-review")}
                </h2>
                <div className="w-full ">
                    <div className="w-full my-2 flex flex-row justify-between">
                        <div className="flex flex-row space-x-2">
                            {[...Array(5)].map((_, ind) =>
                            (ind < userReview.rating
                                ? <FaStar key={ind} className="h-6 w-6 text-[rgb(244,189,98)]" />
                                : <FaRegStar key={ind} className="h-6 w-6 text-[rgb(244,189,98)]" />
                            ))}
                        </div>
                        <p className="text-sm xl:text-xl font-medium opacity-70">{fortmatFullDate(userReview.createAt)}</p>
                    </div>
                    <textarea rows={7} disabled defaultValue={userReview.comment} className="mx-auto p-5 mb-5 w-full border border-gray-300 outline-[rgba(24,119,242,0.3)] rounded-md" />
                </div>
            </div>
        </>
    );
}
const Comment = ({ comment }) => {
    const { t } = useTranslation("global");
    const titles = {
        1: t("product.1star"),
        2: t("product.2star"),
        3: t("product.3star"),
        4: t("product.4star"),
        5: t("product.5star")
    };
    const title = titles[comment?.rating] || t("product.1star");
    return (
        <div className="w-full flex flex-col justify-start items-start space-y-4 pb-6 border-b-2 border-[rgb(230,230,230)]">
            <div className="flex w-full flex-row justify-between items-center">
                <div className="flex flex-row space-x-4">
                    <img className="w-[5rem] h-[5rem] rounded-[50%]" src={(comment?.user?.avatar ? getAvatar(comment?.user?.avatar) : noAvatar)} alt="" />
                    <div className="flex flex-col justify-around items-start">
                        <div className="sm:text-xl font-semibold">
                            {comment?.user ? comment?.user?.name : "user"}
                        </div>
                        <div className="text-base font-medium">
                            ({t("product.verify")})
                        </div>
                    </div>
                </div>
                <p className="text-sm xl:text-xl font-medium opacity-70">{fortmatFullDate(comment.createAt)}</p>
            </div>
            <p className="text-xl font-bold pt-4">{title}</p>
            <p>{comment?.comment}</p>
            <div className="flex flex-row space-x-2">
                {[...Array(comment?.rating)].map((_, index) => (
                    <FaStar key={index} className="h-6 w-6 text-[rgb(244,189,98)]" />
                ))}
                <p className="text-xl font-medium">{comment?.rating}</p>
            </div>
            {comment?.review_image?.length ? (
                <div className="flex flex-row space-x-3 w-full overflow-x-auto">
                    {comment?.image?.map((img, index) => (
                        <img key={index} className="max-h-[15rem] h-auto  cursor-pointer backdrop:w-full" src={img} alt />
                    ))}
                </div>) : null
            }
        </div>
    )
}

const ProductReview = ({ reviews, productId, userReview }) => {
    const { t } = useTranslation("global");
    const [comments, setComments] = useState([]);
    const [reviewInfo, setReviewInfo] = useState({});
    const handleSort = (value) => {
        if (value === "newest") {
            const sortedComments = [...comments].sort((a, b) => {
                const createAtA = new Date(a.createAt);
                const createAtB = new Date(b.createAt);
                return createAtB - createAtA;
            });
            setComments(sortedComments);
        } else {
            const sortedComments = [...comments].sort((a, b) => {
                const createAtA = new Date(a.createAt);
                const createAtB = new Date(b.createAt);
                return createAtA - createAtB;
            });
            setComments(sortedComments);
        }
    }
    useEffect(() => {
        setComments(reviews);
        const starCnt = [0, 0, 0, 0, 0];
        const starPercent = [0, 0, 0, 0, 0];
        var avgStar = 0;
        for (let i = 0; i < reviews.length; i++) {
            if (reviews[i].rating == 0) continue;
            starCnt[reviews[i].rating - 1]++;
            avgStar += reviews[i].rating;
        }
        for (var i = 0; i < starCnt.length; i++)
            starPercent[i] = Math.round(starCnt[i] / reviews.length * 100);
        reviewInfo.stars = starCnt;
        reviewInfo.starPercent = starPercent;
        reviewInfo.avgStar = Math.round(avgStar / reviews.length * 100) / 100;
    }, [reviews])
    return (
        <div className="space-y-6">
            {comments.length
                ? <>
                    <div className="flex flex-row pb-10  border-b-2 border-b-[rgb(230,230,230)]">
                        <div className="lg:w-1/4 md:w-1/3 min-h-[10rem] flex flex-col items-center justify-around md:pr-0 pr-[7px] border-r-2 border-r-[rgb(230,230,230)]">
                            <div className="md:text-2xl font-normal">
                                <span className="md:text-4xl text-2xl font-bold">{reviewInfo?.avgStar}</span>
                                / 5
                            </div>
                            <div className="md:space-x-2 space-x-1 flex flex-row">
                                <FaStar className="md:h-8 w-6 h-6 md:w-8 text-[rgb(244,189,98)]" />
                                <FaStar className="md:h-8 w-6 h-6 md:w-8 text-[rgb(244,189,98)]" />
                                <FaStar className="md:h-8 w-6 h-6 md:w-8 text-[rgb(244,189,98)]" />
                                <FaStar className="md:h-8 w-6 h-6 md:w-8 text-[rgb(244,189,98)]" />
                                <FaStar className="md:h-8 w-6 h-6 md:w-8 text-[rgb(244,189,98)]" />
                            </div>
                            <div className="md:text-xl">
                                ({comments?.length} {" "} {t("product.reviews")})
                            </div>
                        </div>
                        <div className="lg:w-4/5 md:w-2/3 w-full flex flex-col justify-between pl-[5%]">
                            {reviewInfo?.stars.map((_, index) => (
                                <div key={index} className="flex flex-row items-center space-x-8 ">
                                    <span className="md:text-xl min-w-[5rem] font-semibold">{5 - index} {t("product.star")}</span>
                                    <div className="md:w-[80%] w-full h-3 bg-[rgb(238,238,238)] rounded-2xl relative">
                                        <div style={{ width: reviewInfo?.starPercent[4 - index] + '%' }} className={`h-3 absolute z-10 bg-[rgb(244,189,98)] rounded-2xl `}>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-full">
                        {isLogin() &&
                            (userReview == ""
                                ? <CreateComment productId={productId} />
                                : <UserComment userReview={userReview} />
                            )}
                        <div className="lg:w-[80%] w-full my-5 mx-auto flex flex-row justify-between md:min-h-20">
                            <div className="flex flex-col justify-between">
                                <h1 className="md:text-2xl text-xl font-semibold">{t("product.review-list")}</h1>
                                <p>
                                    {t("products.show")} 1 - {comments?.length} {t("products.of")} {comments?.length} {" "}
                                    {t("products.result")}
                                </p>
                            </div>
                            <div className="flex flex-row items-center text-xl sm:mt-0 mt-2">
                                <span className="sm:block hidden">{t("products.sort.title")}</span>
                                <select
                                    name="sort"
                                    className="border-2 px-4 sm:ml-2 ml-0 py-1 font-medium"
                                    onChange={(e) => handleSort(e.target.value)}
                                >
                                    <option value="newest">{t("product.new")}</option>
                                    <option value="oldest">{t("product.old")}</option>
                                </select>
                            </div>
                        </div>
                        <div className=" mt-[3rem] space-y-4 xl:mx-[20rem]">
                            {Array.isArray(comments) && comments?.map((comment, index) => (
                                <Comment key={index} comment={comment} />
                            ))}
                        </div>
                    </div>
                </>
                : <>
                    {isLogin() &&
                        (userReview == ""
                            ? <CreateComment productId={productId} />
                            : <UserComment userReview={userReview} />
                        )}
                    <div className="w-full h-full flex flex-col justify-start items-center">
                        <div className="sm:h-[17rem] h-[8rem] overflow-hidden"><img src={img} className="sm:w-[20rem] w-[10rem] h-[10rem] sm:h-[20rem]" alt="Comment IMG" /></div>
                        <p className="sm:text-xl px-10 text-center font-semibold text-[rgb(62,24,0)]">{t("product.no-review")}</p>
                    </div>
                </>
            }
        </div>
    )
}

export default ProductReview;