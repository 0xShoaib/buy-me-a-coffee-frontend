import React from "react";
import Image from "next/image";
import moment from "moment";

const MemoListCard = ({ accountAddress, memos = [] }) => {
  const getFormattedTimestamp = (timestamp) => {
    const ts = moment(timestamp.toString() * 1000);

    return `${ts.format("MMM Do, YYYY - HH:mm:SS a")} GMT${ts.format("Z")}`;
  };

  const sortedArray = [...memos];
  sortedArray.sort(
    (a, b) =>
      parseFloat(b.timestamp.toString()) - parseFloat(a.timestamp.toString())
  );

  const mappedMemos = () =>
    sortedArray.length > 0 ? (
      sortedArray.map((memo, idx) => {
        return (
          <div key={idx} className="memo">
            <h4 className="memo--name">
              <div className="memo--avatar">
                <Image src="/img/coffee.png" alt="C" width={15} height={20} />
              </div>
              {memo.name}
            </h4>
            <p className="memo--time">
              {getFormattedTimestamp(memo.timestamp)}
            </p>
            <p className="memo--message">{memo.message}</p>
          </div>
        );
      })
    ) : (
      <p className="memo-list-card--helper-text">No supporters found.</p>
    );

  return (
    <div className="memo-list-card">
      <h2 className="memo-list-card--title">Recent Supporters</h2>
      <div className="memo-list-card--items">
        {accountAddress ? (
          mappedMemos()
        ) : (
          <p className="memo-list-card--helper-text">
            Ops! Connect with you wallet to view the recent supporters
          </p>
        )}
      </div>
    </div>
  );
};

export default MemoListCard;
