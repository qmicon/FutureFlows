import Img from "next/image";
import Link from "next/link";
import React from "react";
import Web3 from "web3";

export const MarketCard = ({
  id,
  title,
  totalAmount,
  totalYes,
  totalNo,
  imageHash
}) => {
  return (
    <div className="w-full overflow-hidden sm:my-1 sm:px-1 sm:w-1/3 md:my-2 md:px-2 md:w-1/3 lg:w-1/3 xl:w-1/3 my-2">
      <Link href={`/market/${id}`} passHref>
        <div className="flex flex-col border border-gray-300 rounded-lg p-3 hover:border-blue-700 cursor-pointer">
          <div className="flex flex-row space-x-5 pb-8">
            <div className="w-12  h-w-12 ">
              <img
                src={`https://${imageHash}.ipfs.w3s.link/market.png`}
                className="rounded-full"
                width={100}
                height={100}
              />
            </div>
            <span className="text-sm">{title}</span>
          </div>
          <div className="flex flex-row flex-nowrap justify-between items-center">
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-gray-500 font-light">Volume</span>
              <span className="text-sm">
                {parseFloat(totalAmount).toFixed(2)}{" "}
                USDC
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-gray-500 font-light">Yes</span>
              <div className="px-1 bg-gray-200 text-center rounded-sm">
                <span className="text-xs font-medium text-blue-700">
                  {parseFloat(totalYes).toFixed(2)}{" "}
                  USDC
                </span>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-gray-500 font-light">No</span>
              <div className="px-1 bg-gray-200 text-center rounded-sm">
                <span className="text-xs font-medium text-blue-700">
                  {parseFloat(totalNo).toFixed(2)}{" "}
                  USDC
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};