import React, { useEffect, useState } from "react";
import Head from "next/head";
import { ethers } from "ethers";
import { toast, ToastContainer, Slide } from "react-toastify";

import abi from "../utils/BuyMeACoffee.json";

import Header from "../components/header";
import Footer from "../components/footer";
import BuyCoffeeCard from "../components/buy-coffee-card";
import MemoListCard from "../components/memo-list-card";
import AdminModal from "../components/admin-modal";

export default function Home() {
  // Contract Address & ABI
  const contractAddress = "0xB829A8dde3fD6bBA665cF74Efdd4eD7667f57bf6";
  const contractABI = abi.abi;

  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  const [memos, setMemos] = useState([]);
  const [isActionBtnLoading, setIsActionBtnLoading] = useState(false);
  const [resetForm, setResetForm] = useState(false);
  const [showAdminActions, setShowAdminActions] = useState(false);

  // Check wallet is connected or not
  const checkIsWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("checkIsWalletConnected > MetaMask is not connected");
      }
    } catch (error) {
      toast.error("Ops! No connected wallet found.");
      console.log("error: ", error);
    }
  };

  // Connect with wallet
  const onConnectWallet = async () => {
    try {
      const { ethereum } = window;
      setIsActionBtnLoading(true);

      if (!ethereum) {
        toast("Please install MetaMask!", { icon: "💡" });
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      setIsActionBtnLoading(false);
    } catch (error) {
      setIsActionBtnLoading(false);
      toast.error("Ops! Failed to connect with wallet.");
      console.log(error);
    }
  };

  const onBuyCoffee = async (name, message, tip) => {
    try {
      const { ethereum } = window;
      setIsActionBtnLoading(true);

      if (ethereum) {
        toast.loading("Buying Shoaib a coffee...", { autoClose: false });

        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name || "Anonymous Supporter",
          message || "Enjoy your coffee!",
          { value: ethers.utils.parseEther(tip) }
        );

        await coffeeTxn.wait();
        toast.dismiss();
        onNewMemo();
        setIsActionBtnLoading(false);
        setResetForm(true);
        toast.success("Awesome! Coffee purchased.");
      }
    } catch (error) {
      toast.dismiss();
      setIsActionBtnLoading(false);
      console.log(error);
      toast.error("Ops! Failed to buy a coffee.");
    }
  };

  // Get all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window;

      if (ethereum && currentAccount) {
        const provider = new ethers.providers.Web3Provider(ethereum);

        const signer = provider.getSigner();

        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const memosData = await buyMeACoffee.getMemos();
        setMemos(memosData);
      } else {
        console.log(
          "getMemos > MetaMask is not connected or current account address is empty"
        );
      }
    } catch (error) {
      toast.error("Ops! Failed to get the memos.");
      console.log(error);
    }
  };

  // Create an event handler function for when someone sends us a new memo.
  const setNewMemo = (from, timestamp, name, message) => {
    setMemos((prevState) => {
      console.log("prevState ", prevState);
      return [
        ...prevState,
        {
          address: from,
          timestamp,
          message,
          name,
        },
      ];
    });
  };

  const onNewMemo = () => {
    let buyMeACoffee;

    const { ethereum } = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);

      buyMeACoffee.on("NewMemo", setNewMemo);
    }
  };

  // Change withdrawal address
  const changeWithdrawalAddress = async (address) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        toast.loading("Changing withdrawal address..", { autoClose: false });

        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const withdrawalOwnerTxn = await buyMeACoffee.updateWithdrawalOwner(
          address
        );

        await withdrawalOwnerTxn.wait();
        toast.dismiss();
        toast.success("Withdrawal Address changed.");
      }
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.error("Ops! Failed to change the address.");
    }
  };

  const onWithdrawCoffee = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        toast.loading("Withdrawing coffee..", { autoClose: false });

        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const withdrawCoffeeTxn = await buyMeACoffee.withdrawTips();

        await withdrawCoffeeTxn.wait();
        toast.dismiss();
        toast.success("Awesome! Coffee withdrew.");
      }
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.error("Ops! Failed to withdraw coffee.");
    }
  };

  useEffect(() => {
    checkIsWalletConnected();

    if (window && window.ethereum) {
      const { ethereum } = window;

      ethereum.on("accountsChanged", (accounts) => {
        if (!accounts.length > 0) {
          setCurrentAccount("");
        }
      });
    }
  }, []);

  useEffect(() => {
    getMemos();
  }, [currentAccount]);

  return (
    <>
      <Head>
        <title>Buy Shoaib a Coffee!</title>
        <meta name="description" content="Tipping site" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>

      <Header
        accountAddress={currentAccount}
        onConnectWallet={onConnectWallet}
        isActionBtnLoading={isActionBtnLoading}
        setShowAdminActions={setShowAdminActions}
      />

      <main>
        <div className="container">
          <div className="container--left">
            <BuyCoffeeCard
              accountAddress={currentAccount}
              onBuyCoffee={onBuyCoffee}
              onConnectWallet={onConnectWallet}
              isActionBtnLoading={isActionBtnLoading}
              resetForm={resetForm}
              setResetForm={setResetForm}
            />
          </div>
          <div className="container--right">
            <MemoListCard accountAddress={currentAccount} memos={memos} />
          </div>
        </div>
      </main>

      <Footer />

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Slide}
      />

      <AdminModal
        isOpen={showAdminActions}
        setShowAdminActions={setShowAdminActions}
        changeWithdrawalAddress={changeWithdrawalAddress}
        onWithdrawCoffee={onWithdrawCoffee}
      />
    </>
  );
}
