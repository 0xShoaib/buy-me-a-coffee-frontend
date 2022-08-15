import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { ethers } from "ethers";
import { toast } from "react-toastify";

const AdminModal = ({
  isOpen,
  setShowAdminActions,
  changeWithdrawalAddress,
  onWithdrawCoffee,
}) => {
  const [withdrawalAddress, setWithdrawalAddress] = useState("");

  const onWithdrawalAddressChange = () => {
    if (ethers.utils.isAddress(withdrawalAddress)) {
      changeWithdrawalAddress(withdrawalAddress);
    } else {
      toast.error("Ops! Please enter a valid address.");
    }
  };

  useEffect(() => {
    return () => {
      setWithdrawalAddress("");
    };
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen}>
      <div className="admin-modal-header">
        <button
          className="close-btn"
          onClick={() => setShowAdminActions(false)}
        >
          X
        </button>
      </div>

      <div className="admin-modal">
        <div className="buy-coffee-card--group">
          <label className="buy-coffee-card--label">
            Enter New Withdrawal Address
          </label>
          <input
            id="name"
            type="text"
            className="buy-coffee-card--input"
            value={withdrawalAddress}
            onChange={(e) => setWithdrawalAddress(e.target.value)}
          />
        </div>

        <button
          className="buy-coffee-card--btn no-bg"
          onClick={onWithdrawalAddressChange}
        >
          Change Address
        </button>

        <p className="memo-list-card--helper-text">
          *Note - Above action can only be performed by the owner of the
          contract.
        </p>

        <div className="divider">
          <span>OR</span>
        </div>

        <button className="buy-coffee-card--btn" onClick={onWithdrawCoffee}>
          Withdraw Coffee
        </button>
      </div>
    </Modal>
  );
};

export default AdminModal;
