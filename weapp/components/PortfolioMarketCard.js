import moment from "moment";
import React from "react";
import Web3 from "web3";


export const PortfolioMarketCard = ({
  title,
  userYes,
  userNo,
  id,
  totalYes,
  totalNo,
  totalAmount,
  hasResolved,
  imageHash,
  timestamp,
  endTimestamp,
}) => {
  var endingOn = moment(parseInt(endTimestamp));
  var now = moment(new Date()); 
  var daysLeft = moment.duration(endingOn.diff(now)).asDays().toFixed(0);
  return (
    <div className="w-full overflow-hidden my-2">
      <div className="flex flex-col border border-gray-300 rounded-lg p-5 hover:border-blue-700 cursor-pointer">
        <div className="flex flex-row space-x-5 pb-4">
          <div className="h-w-15">
            <img
              src={`https://${imageHash}.ipfs.w3s.link/market.png`}
              className="rounded-full"
              width={55}
              height={55}
            />
          </div>
          <span className="text-lg font-semibold">{title}</span>
        </div>
        <div className="flex flex-row flex-nowrap justify-between items-center">
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-gray-500 font-light">Outcome</span>
            <span className="text-base">{userYes ? "YES" : "NO"}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-gray-500 font-light">
              Amount Added
            </span>
            <span className="text-base">
              {userYes ?? userNo} USDC
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-gray-500 font-light">Added On</span>
            <span className="text-base">
              {timestamp
                ? moment(parseInt(timestamp) * 1000).format(
                    "MMMM D, YYYY HH:mm a"
                  )
                : "N/A"}
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-gray-500 font-light">Ending In</span>
            <span className="text-base">
              {parseInt(daysLeft) > 0 ? `${daysLeft} days` : "Ended"}
            </span>
          </div>
          <div className="flex flex-col space-y-1 items-end">
            <div className="py-2 px-8 rounded-lg bg-blue-700 text-white">
              Trade
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
