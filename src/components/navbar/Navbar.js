import React, { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "../../styles/navbar/Navbar.css";
import { NavLink } from "react-router-dom";
import { derivativeInstance } from "../Contract";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import logo from '../../assets/ClimaShield_1.png'

function Navbar() {
  const [isOwner, setIsOwner] = useState(false);
  const { address } = useAccount();

  const verifyAddr = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const con = await derivativeInstance();
        const deployer = await con.getDeployerAddress();
        if (deployer === address) {
          setIsOwner(true);
        }
      }
    } catch (e) {
      console.log("Error in creating user account: ", e);
    }
  };

  useEffect(() => {
    verifyAddr();
  });

  return (
    <div className="navbar-component sticky-top">
      <nav
        className={`navbar navbar-expand-lg navbar-light py-2 `}
        role="navigation"
      >
        <div className="container-fluid px-4 px-md-5 navbar ">
          <a className="d-flex navbar-brand " href="/">
            {/* <h1>LOGO</h1> */}
            <img src={logo} className="img-logo" width={10} />
          </a>

         
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarRightAlignExample"
          >
            <ul className="d-lg-flex navbar-nav align-items-center mb-2 mb-lg-0 navbar-container ">
              <li className="nav-item py-2 px-lg-2">
                <NavLink
                  className="nav-link px-1 p-0 d-flex align-items-center"
                  to="/"
                >
                  <span className="landing-navbar">Home</span>
                </NavLink>
              </li>
              <li className="nav-item py-2 px-lg-2">
                <NavLink
                  className="nav-link px-1 p-0 d-flex align-items-center"
                  to="/derivatives"
                >
                  <span className="landing-navbar">Derivatives</span>
                </NavLink>
              </li>
              <li className="nav-item py-2 px-lg-2">
                <NavLink
                  className="nav-link px-1 p-0 d-flex align-items-center"
                  to="/analysis"
                >
                  <span className="landing-navbar">Analysis</span>
                </NavLink>
              </li>
              <li className="nav-item py-2 px-lg-2">
                <NavLink
                  className="nav-link px-1 p-0 d-flex align-items-center"
                  to="/profile"
                >
                  <span className="landing-navbar">Profile</span>
                </NavLink>
              </li>
              <li className="nav-item py-2 px-lg-2">
                <a
                  className="nav-link px-1 p-0 d-flex align-items-center"
                  href=""
                  target="_blank" rel="noopener noreferrer"
                >
                  <span className="landing-navbar">Docs</span>
                </a>
              </li>

              {isOwner ? (
                <li className="nav-item py-2 px-lg-2">
                  <NavLink
                    className="nav-link px-1 p-0 d-flex align-items-center"
                    to="/create"
                  >
                    <span className="landing-navbar">Create</span>
                  </NavLink>
                </li>
              ) : (
                ""
              )}

              <li className="nav-item py-2 px-2">
                <ConnectButton />
              </li>
            </ul>
          
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
