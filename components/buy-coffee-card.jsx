import React, { useEffect, useState } from "react";
import Image from "next/image";

const BuyCoffeeCard = ({
  accountAddress,
  onBuyCoffee,
  onConnectWallet,
  isActionBtnLoading,
  resetForm,
  setResetForm,
}) => {
  const tipValue = 0.001;

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [tip, setTip] = useState(1);

  const getTipValueInEth = () => (tip * tipValue).toFixed(3);

  const getButtonClassName = (btnValue) =>
    Number(tip) === btnValue ? "active" : "";

  const onTipInputHandler = (e) => {
    const { value } = e.target;
    if (value <= 1000 && value.length < 5) {
      setTip(value);
    }
  };

  const onAction = () => {
    if (accountAddress) {
      onBuyCoffee(name, message, getTipValueInEth().toString());
    } else {
      onConnectWallet();
    }
  };

  const getActionBtnText = () => {
    if (accountAddress) {
      if (isActionBtnLoading) {
        return "Buying Shoaib a coffee..";
      }
      return `Send ${tip || 0} Coffee For ${getTipValueInEth()} ETH`;
    }

    if (!accountAddress) {
      if (isActionBtnLoading) {
        return "Connecting with wallet..";
      }

      return "Connect Your Wallet";
    }

    return "Click";
  };

  useEffect(() => {
    if (resetForm) {
      setName("");
      setMessage("");
      setTip(1);
      setResetForm(false);
    }
  }, [resetForm]);

  return (
    <div className="buy-coffee-card">
      <h2 className="buy-coffee-card--title">
        Buy <span>Shoaib</span> a Coffee!
      </h2>

      {accountAddress && (
        <>
          <div className="buy-coffee-card--group">
            <label className="buy-coffee-card--label">Name</label>
            <input
              id="name"
              type="text"
              className="buy-coffee-card--input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="buy-coffee-card--group">
            <label className="buy-coffee-card--label">Message</label>
            <textarea
              required
              rows={3}
              id="message"
              className="buy-coffee-card--textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <div className="buy-coffee-card--tip">
            <Image width={25} height={30} src="/img/coffee.png" alt="Logo" />
            <p>x</p>
            <button className={getButtonClassName(1)} onClick={() => setTip(1)}>
              1
            </button>
            <button className={getButtonClassName(3)} onClick={() => setTip(3)}>
              3
            </button>
            <button className={getButtonClassName(5)} onClick={() => setTip(5)}>
              5
            </button>
            <input
              type="number"
              min={1}
              max={9999}
              value={tip}
              onChange={onTipInputHandler}
            />
          </div>
        </>
      )}

      <button
        className="buy-coffee-card--btn"
        onClick={onAction}
        disabled={isActionBtnLoading}
      >
        {getActionBtnText()}
      </button>
    </div>
  );
};

export default BuyCoffeeCard;
