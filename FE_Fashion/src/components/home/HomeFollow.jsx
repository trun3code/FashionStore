import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa6";
import test from "../../assets/shoes.jpg";

const socials = [
  {
    img: test,
    link: "https://www.facebook.com",
    type: "facebook",
  },
  {
    img: test,
    link: "https://www.facebook.com",
    type: "instagram",
  },
  {
    img: test,
    link: "https://www.facebook.com",
    type: "tiktok",
  },
  {
    img: test,
    link: "https://www.facebook.com",
    type: "youtube",
  },
];

const FollowCard = ({ img, link, type }) => {
  return (
    <div className="md:w-[20rem] min-w-[360px]  md:h-[20rem] relative group/item transition-[slide] ">
      <a href={link} target="_blank">
        <img className="w-full h-full" src={img} alt="test" />
        <div className="cursor-pointer absolute w-full h-full top-0 bg-[rgba(0,0,0,0.5)] hidden group-hover/item:flex items-center justify-center">
          {type === "facebook" ?
            <FaFacebook className="h-[4rem] w-[4rem] text-white" />
            : type === "instagram" ?
              <FaInstagram className="h-[4rem] w-[4rem] text-white" />
              : type === "tiktok" ?
                <FaTiktok className="h-[4rem] w-[4rem] text-white" />
                : <FaYoutube className="h-[4rem] w-[4rem] text-white" />
          }
        </div>
      </a>
    </div>
  );
};

const HomeFollow = () => {
  const { t } = useTranslation("global");
  const containerRef = useRef(null);

  return (
    <section className="w-full bg-[rgb(245,245,245)] lg:py-16 py-8 relative">
      <div className="w-full text-center px-2">
        <h1 className="lg:text-4xl text-[28px] font-bold my-4">
          {t("homepage.follow.subtitle")}
        </h1>
      </div>
      <div className="w-full flex flex-row mt-16 lg:overflow-hidden overflow-x-auto whitespace-nowrap px-3" ref={containerRef}>
        {socials.map((social, index) => (
          <div key={index} className="inline-block w-fit mr-8 md:mr-8 lg:mt-8 lg:mr-6 last:mr-0 ">
            <FollowCard img={social.img} link={social.link} type={social.type} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeFollow;
