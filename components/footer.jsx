import React from "react";

const Footer = () => {
  return (
    <footer>
      <p className="created-by">
        Project created by{" "}
        <a
          href="https://shoaibsayyed.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Shoaib Sayyed
        </a>
      </p>
      <div className="socials">
        <a
          href="https://twitter.com/shoaib_eth"
          target="_blank"
          rel="noopener noreferrer"
        >
          connect on twitter
        </a>
        <span>·</span>
        <a
          href="https://github.com/shoaib-03"
          target="_blank"
          rel="noopener noreferrer"
        >
          view code on github
        </a>
      </div>
      <p className="supporters">
        Supported by @AlchemyPlatform · @RoadToWeb3 · @thatguyintech
      </p>
    </footer>
  );
};

export default Footer;
