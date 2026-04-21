import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CustomButton from "../CustomButton/CustomButton";
import { FaChevronRight } from "react-icons/fa6";

const Card = ({
  imageUrl = "/placeholder.jpg",
  altText = "Blog Image",
  hrefLink = "#",
  title = "No title found",
  cardkey = "",
  createdAt = "",
}) => {
  const [imgSrc, setImgSrc] = useState(imageUrl);
  return (
    <Link href={hrefLink} key={cardkey}>
      <div
        className="rounded-[10px]  overflow-hidden 
              shadow-md transition-all duration-300 ease-in-out bg-primary-gray
              hover:scale-105 hover:shadow focus:scale-105 focus:shadow active:scale-105 active:shadow cursor-pointer"
      >
        <div className="relative w-full h-[180px]   rounded-br-[20px]  overflow-hidden">
          <Image
            src={
              imgSrc ||
              "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/no-image/no-image.png"
            }
            fill
            quality={90}
            alt={altText}
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-focus:scale-110 group-active:scale-110"
            onError={() =>
              setImgSrc(
                "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/no-image/no-image.png",
              )
            }
          />
        </div>
        <div className="p-3">
          <p className="text-slate-500 text-[13px]">{createdAt}</p>
          <h3 className="line-clamp-2 mt-3 mb-4 h-[50px]">{title}</h3>
          <CustomButton
            color="#6e6146ff"
            height="30px"
            href={hrefLink}
            textColor="#D1C8C1"
            className="px-4 text-md"
          >
            <div className="flex items-center gap-2">
              Explore More <FaChevronRight size={15} />
            </div>
          </CustomButton>
        </div>
      </div>
    </Link>
  );
};

export default Card;
