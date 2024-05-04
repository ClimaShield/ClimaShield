import React, { useState , useEffect} from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";
import "../../styles/create/CreateContract.css";
import { derivativeInstance } from "../Contract";
import { FaImage } from "react-icons/fa6";


function CreateContract() {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    location: "",
    coverageStartDate: "",
    coverageEndDate: "",
    strikeValue: "",
    premiumAmount: "",
    payoutAmount: "",
    maxBuyers: "",
  });
  const { address } = useAccount();
  const navigate = useNavigate();
  const [btnloading, setbtnloading] = useState(false);

  const client = new Web3Storage({
    token: process.env.REACT_APP_STORAGE_TOKEN,
  });

  const uploadImage = async () => {
    try {
      const fileInput = document.querySelector('input[type="file"]');
      console.log("ipfs client: ", client);

      const rootCid = await client.put(fileInput.files, {
        name: formData.image.name,
        maxRetries: 3,
      });

      console.log(formData);
      return rootCid + "/" + fileInput.files[0].name;
    } catch (e) {
      console.log(e);
    }
  };

  const startDateToUnixTime = () => {
    const dateObject = new Date(formData.coverageStartDate);
    return Math.floor(dateObject.getTime() / 1000);
  };

  const endDateToUnixTime = () => {
    const dateObject = new Date(formData.coverageEndDate);
    return Math.floor(dateObject.getTime() / 1000);
  };

  const handleCreate = async () => {
    try {
      setbtnloading(true);
      const cid = await uploadImage();
      console.log("cid: ", cid);

      console.log("Form Data: ", formData);
      const { ethereum } = window;

      console.log("Start date: ", startDateToUnixTime());
      console.log("End date: ", endDateToUnixTime());

      const startTime = startDateToUnixTime();
      const endTime = endDateToUnixTime();

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const con = await derivativeInstance();
        console.log("Hello");
        const tx = await con.createContract(
          formData.name,
          cid,
          formData.description,
          formData.location,
          startTime,
          endTime,
          formData.strikeValue,
          formData.premiumAmount,
          formData.payoutAmount,
          formData.maxBuyers
        );

        console.log(tx);
        await tx.wait();
        setbtnloading(false);
        navigate("/derivatives");
      }
    } catch (e) {
      console.log("Error in creating user account: ", e);
    }
  };

  useEffect(() => {
    // Enable Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(
      (tooltipTriggerEl) => new window.bootstrap.Tooltip(tooltipTriggerEl)
    );

    // Clean up when the component unmounts
    return () => {
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        const tooltip = window.bootstrap.Tooltip.getInstance(tooltipTriggerEl);
        if (tooltip) {
          tooltip.dispose();
        }
      });
    };
  });

  return (
    <>
      <div className="f-title-container">
        <h1 className="f-title">Create Weather Derivatives</h1>
      </div>
      <div className="f-form-main">
        <div className="f-form-container">
          <div className="f-img-container f-div">
            <label className=" f-label">Upload Image</label>
            

            <input
              className="f-input-file f-input"
              type="file"
              
              onChange={(e) => {
                setFormData({
                  ...formData,
                  image: e.target.value,
                });
              }}
              />
              
             
          </div>

          <div className="f-name-location">
            <div className="f-name-container f-div">
              <div className="f-label-main">

              <label className=" f-label">Name</label>
              <a
                      href="#"
                      data-bs-toggle="tooltip"
                      data-bs-placement="right"
                      title="This field displays the type of the contract."
                      className="icon-link f-tooltip"
                    >
                      <i className="fas fa-info-circle head-info"></i>
                    </a>
              </div>
              <input
                type="text"
                className="f-input-name f-input"
                value={formData.name}
                placeholder="Enter Your Name"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  });
                }}
              />
            </div>

            <div className="f-location-container f-div">

              <div className="f-label-main">

              <label className="f-label">Location</label>

              <a
                      href="#"
                      data-bs-toggle="tooltip"
                      data-bs-placement="right"
                      title="The place where the HDD/CDD of the given contract are based on."
                      className="icon-link f-tooltip"
                      >
                      <i className="fas fa-info-circle head-info"></i>
                    </a>
                      </div>
              <input
                type="text"
                className="f-input-location f-input"
                placeholder="Enter Your Location"
                value={formData.location}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    location: e.target.value,
                  });
                }}
              />
            </div>
          </div>

          <div className="f-div">
            <div className="f-label-main">

            <label className="f-label">Description</label>
            <a
                      href="#"
                      data-bs-toggle="tooltip"
                      data-bs-placement="right"
                      title="A short summary that tells you the basic details and what the contract is all about."
                      className="icon-link f-tooltip"
                      >
                      <i className="fas fa-info-circle head-info"></i>
                    </a>
                      </div>
            <textarea
              className="f-input-description f-input"
              rows="3"
              value={formData.description}
              placeholder="Add Your Description"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  description: e.target.value,
                });
              }}
            ></textarea>
          </div>

          <div className="f-start-end">
            <div className="f-div">
              <div className="f-label-main">

              <label className="f-label">Coverage Start Date</label>
              <a
                      href="#"
                      data-bs-toggle="tooltip"
                      data-bs-placement="right"
                      title="The day when the contract's execution begins."
                      className="icon-link f-tooltip"
                      >
                      <i className="fas fa-info-circle head-info"></i>
                    </a>
                      </div>
              <input
                type="date"
                className="f-input-date f-input"
                value={formData.coverageStartDate}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    coverageStartDate: e.target.value,
                  });
                }}
              />
            </div>

            <div className="f-div">
              <div className="f-label-main">

              <label className="f-label">Coverage End Date</label>
              <a
                      href="#"
                      data-bs-toggle="tooltip"
                      data-bs-placement="right"
                      title="The day when the contract is terminated."
                      className="icon-link f-tooltip"
                    >
                      <i className="fas fa-info-circle head-info"></i>
                    </a>
                    </div>
              <input
                type="date"
                className="f-input-date f-input"
                value={formData.coverageEndDate}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    coverageEndDate: e.target.value,
                  });
                }}
              />
            </div>
          </div>

          <div className="f-value-buyer">
            <div className="f-div">
              <div className="f-label-main">

              <label className="f-label">Strike Value</label>
              <a
                      href="#"
                      data-bs-toggle="tooltip"
                      data-bs-placement="right"
                      title="It is a threshold value above which it is expected that HDD/CDD will not exceed."
                      className="icon-link f-tooltip"
                      >
                      <i className="fas fa-info-circle head-info"></i>
                    </a>
                      </div>
              <input
                type="number"
                className="f-number f-input"
                min={0}
                value={formData.strikeValue}
                placeholder="0"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    strikeValue: e.target.value,
                  });
                }}
              />
            </div>

            <div className="f-div">
              <div className="f-label-main">

              <label className="f-label">Maximum Buyers</label>
              <a
                      href="#"
                      data-bs-toggle="tooltip"
                      data-bs-placement="right"
                      title="The most people allowed to have this contract, so you know how many others can join in."
                      className="icon-link f-tooltip"
                      >
                      <i className="fas fa-info-circle head-info"></i>
                    </a>
                      </div>
              <input
                type="number"
                className="f-number f-input"
                min={0}
                placeholder="0"
                value={formData.maxBuyers}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    maxBuyers: e.target.value,
                  });
                }}
              />
            </div>
          </div>

          <div className="f-payout-premium">

          <div className="f-div">
                <div className="f-label-main">

              <label className="f-label">Premium Amount</label>
              <a
                      href="#"
                      data-bs-toggle="tooltip"
                      data-bs-placement="right"
                      title="The amount you pay at the beginning to buy the contract."
                      className="icon-link f-tooltip"
                      >
                      <i className="fas fa-info-circle head-info"></i>
                    </a>
                      </div>
              <input
                type="number"
                className="f-number f-input"
                min={0}
                placeholder="0"
                value={formData.premiumAmount}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    premiumAmount: e.target.value,
                  });
                }}
              />
            </div>
            <div className="f-div">
              <div className="f-label-main">

              <label className="f-label">Payout Amount</label>
              <a
                      href="#"
                      data-bs-toggle="tooltip"
                      data-bs-placement="right"
                      title="The amount you can get after contract reaches its expiration date and the contract is settled."
                      className="icon-link f-tooltip"
                      >
                      <i className="fas fa-info-circle head-info"></i>
                    </a>
                      </div>
              <input
                type="number"
                className="f-number f-input"
                value={formData.payoutAmount}
                min={0}
                placeholder="0"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    payoutAmount: e.target.value,
                  });
                }}
              />
            </div>
            
          </div>

         
            {/* <button type="button" className="f-btn" onClick={handleCreate}>
              {btnloading ? (
                <>
                  <SyncLoader color="#fff" size={12} speedMultiplier={0.8} />
                </>
              ) : (
                <>Create</>
              )}
            </button> */}
            <button type="button" className="f-btn f-btn-white f-btn-animate" onClick={handleCreate}>
              {btnloading ? (
                <>
                  <SyncLoader color="#fff" size={12} speedMultiplier={0.8} />
                </>
              ) : (
                <>Create</>
              )}
            </button>


          
        </div>
      </div>
    </>
  );
}
//   return (
//     <div className="col-lg-6 col-7 mx-auto py-4">
//       <div className="mb-3">
//         <label className="form-label">
//           Upload Image <span style={{ color: "red" }}>&nbsp;*</span>
//         </label>
//         <input
//           className="form-control form-control-md"
//           type="file"
//           onChange={(e) => {
//             setFormData({
//               ...formData,
//               image: e.target.value,
//             });
//           }}
//         />
//       </div>
//       <div className="mb-3">
//         <label className="form-label">
//           Name <span style={{ color: "red" }}>&nbsp;*</span>
//         </label>
//         <input
//           type="text"
//           className="form-control"
//           value={formData.name}
//           onChange={(e) => {
//             setFormData({
//               ...formData,
//               name: e.target.value,
//             });
//           }}
//         />
//       </div>
//       <div className="mb-3">
//         <label className="form-label">
//           Description <span style={{ color: "red" }}>&nbsp;*</span>
//         </label>
//         <textarea
//           className="form-control"
//           rows="3"
//           value={formData.description}
//           onChange={(e) => {
//             setFormData({
//               ...formData,
//               description: e.target.value,
//             });
//           }}
//         ></textarea>
//       </div>
//       <div className="mb-3">
//         <label className="form-label">
//           Location <span style={{ color: "red" }}>&nbsp;*</span>
//         </label>
//         <input
//           type="text"
//           className="form-control"
//           value={formData.location}
//           onChange={(e) => {
//             setFormData({
//               ...formData,
//               location: e.target.value,
//             });
//           }}
//         />
//       </div>

//       <div className="mb-3">
//         <label className="form-label">
//           Coverage Start Date <span style={{ color: "red" }}>&nbsp;*</span>
//         </label>
//         <input
//           type="date"
//           className="form-control"
//           value={formData.coverageStartDate}
//           onChange={(e) => {
//             setFormData({
//               ...formData,
//               coverageStartDate: e.target.value,
//             });
//           }}
//         />
//       </div>

//       <div className="mb-3">
//         <label className="form-label">
//           Coverage End Date <span style={{ color: "red" }}>&nbsp;*</span>
//         </label>
//         <input
//           type="date"
//           className="form-control"
//           value={formData.coverageEndDate}
//           onChange={(e) => {
//             setFormData({
//               ...formData,
//               coverageEndDate: e.target.value,
//             });
//           }}
//         />
//       </div>

//       <div className="mb-3">
//         <label className="form-label">
//           Strike Value <span style={{ color: "red" }}>&nbsp;*</span>
//         </label>
//         <input
//           type="number"
//           className="form-control"
//           value={formData.strikeValue}
//           onChange={(e) => {
//             setFormData({
//               ...formData,
//               strikeValue: e.target.value,
//             });
//           }}
//         />
//       </div>

//       <div className="mb-3">
//         <label className="form-label">
//           Premium Amount<span style={{ color: "red" }}>&nbsp;*</span>
//         </label>
//         <input
//           type="number"
//           className="form-control"
//           value={formData.premiumAmount}
//           onChange={(e) => {
//             setFormData({
//               ...formData,
//               premiumAmount: e.target.value,
//             });
//           }}
//         />
//       </div>

//       <div className="mb-3">
//         <label className="form-label">
//           Payout Amount<span style={{ color: "red" }}>&nbsp;*</span>
//         </label>
//         <input
//           type="number"
//           className="form-control"
//           value={formData.payoutAmount}
//           onChange={(e) => {
//             setFormData({
//               ...formData,
//               payoutAmount: e.target.value,
//             });
//           }}
//         />
//       </div>

//       <div className="mb-3">
//         <label className="form-label">
//           Maximum Buyers<span style={{ color: "red" }}>&nbsp;*</span>
//         </label>
//         <input
//           type="number"
//           className="form-control"
//           value={formData.maxBuyers}
//           onChange={(e) => {
//             setFormData({
//               ...formData,
//               maxBuyers: e.target.value,
//             });
//           }}
//         />
//       </div>

//       <div className="d-grid">
//         <button
//           type="button"
//           className="btn btn-lg btn-danger"
//           onClick={handleCreate}
//         >
//           {btnloading ? (
//             <>
//               <SyncLoader color="#fff" size={12} speedMultiplier={0.8} />
//             </>
//           ) : (
//             <>Create</>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }

export default CreateContract;
