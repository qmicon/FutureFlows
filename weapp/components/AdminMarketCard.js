import React from "react";
import Web3 from "web3";

export const AdminMarketCard = ({
  title,
  totalAmount,
  onYes,
  onNo,
}) => {
  return (
    <div className="w-full overflow-hidden my-2">
      <div className="flex flex-col border border-gray-300 rounded-lg p-5 hover:border-blue-700 cursor-pointer">
        <div className="flex flex-row space-x-5 pb-4">
          <div className="h-w-15">
          </div>
          <span className="text-lg font-semibold">{title}</span>
        </div>
        <div className="flex flex-row flex-nowrap justify-between items-center">
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-gray-500 font-light">
              Total Liquidity
            </span>
            <span className="text-base">
              {/* {parseFloat(Web3.utils.fromWei(totalAmount, "")).toFixed(2)}{" "} */}
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-gray-500 font-light">Ending In</span>
            <span className="text-base">12 Days</span>
          </div>
          <div className="flex flex-row space-x-2 items-end">
            <button
              className="py-1 px-2 rounded-lg bg-blue-700 text-white"
              onClick={onYes}
            >
              Resolve YES
            </button>
            <button
              className="py-1 px-2 rounded-lg bg-blue-700 text-white"
              onClick={onNo}
            >
              Resolve NO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};