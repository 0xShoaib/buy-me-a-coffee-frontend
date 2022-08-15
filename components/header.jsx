import React from "react";
import Image from "next/image";

const Header = ({
  accountAddress,
  onConnectWallet,
  isActionBtnLoading,
  setShowAdminActions,
}) => {
  const onAddressClick = () => {
    navigator.clipboard.writeText(accountAddress);
  };

  const getAddressToDisplay = () =>
    `${accountAddress.substr(0, 4)}...${accountAddress.substr(
      accountAddress.length - 3
    )}`;

  return (
    <header>
      <div className="logo">
        <Image width={35} height={40} src="/img/coffee.png" alt="Logo" />
      </div>

      {accountAddress ? (
        <div className="actions">
          <p
            className="account-addrs"
            onClick={onAddressClick}
            title="Click to copy"
          >
            {getAddressToDisplay()}
          </p>
          <p
            className="account-addrs owner-panel"
            onClick={() => setShowAdminActions(true)}
            title="View owner panel"
          >
            Owner Panel
          </p>
        </div>
      ) : (
        <button
          className="action-btn"
          onClick={onConnectWallet}
          disabled={isActionBtnLoading}
        >
          Connect
        </button>
      )}
    </header>
  );
};

export default Header;
