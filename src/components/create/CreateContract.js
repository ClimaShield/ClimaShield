import React, { useState , useEffect} from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";
import "../../styles/create/CreateContract.css";
import { derivativeInstance } from "../Contract";
import { FaImage } from "react-icons/fa6";
// import lighthouse from "@lighthouse-web3/sdk";


function CreateContract() {
  const [isFormValid, setIsFormValid] = useState(true);
  const [showSyncLoader, setShowSyncLoader] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  // const [file, setFile] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // let isFormValid = true;
    setIsFormValid(true);
    setShowSyncLoader(false);
    setShowErrorMessage(false);

    // Reset error messages
    for (const field of event.target.elements) {
      field.setCustomValidity('');
    }

    // Validate fields
    for (const field of event.target.elements) {
      if (field.required && field.value.trim() === '') {
        field.setCustomValidity('This field is required');
        // isFormValid = false;
        setIsFormValid(false);
        setShowSyncLoader(false); 
        setShowErrorMessage(true);
      }
    }

    if (isFormValid) {
      // If all fields are valid, proceed with form submission
      setShowSyncLoader(true);
      setShowErrorMessage(false);
      handleCreate();
    }
  };


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

  // const progressCallback = (progressData) => {
  //   let percentageDone =
  //     100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
  // };

  // const uploadImage = async () => {
  //   try {
  //       const output = await lighthouse.upload(
  //       file,
  //       process.env.REACT_APP_LIGHTHOUSE_API_KEY,
  //       false,
  //       progressCallback
  //     );
  //     console.log(output.data.Hash);
  //     return output.data.Hash;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

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
      const cid = "QmeMke67dNBZ9gi13SFycUT7JWWvo9UU9fmMfHSCiQ2Q8Y";
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

  // const handleFileChange = (e) => {
  //   setFile(e.target.files);
  // }

  return (
    <>
      <div className="f-title-container">
        <h1 className="f-title">Create Weather Derivatives</h1>
      </div>
      <div className="f-form-main">
        <div className="f-form-container">
          <form onSubmit={handleSubmit}>
            {/* <div>
            <p style={{ fontSize: "15px" }}>Choose cover image</p>
            <input onChange={handleFileChange} type="file" />

            </div> */}
          <div className="f-img-container f-div">
            <label className=" f-label">Upload Image<span style={{ color: "red" }} className="f-star">&nbsp;*</span></label>
            

            <input
              className="f-input-file f-input"
              type="file"
              required
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

              <label className=" f-label">Contract Name<span style={{ color: "red" }} className="f-star">&nbsp;*</span></label>
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
                placeholder="Enter Contract Name"
                required
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

              <label className="f-label">Location<span style={{ color: "red"}} className="f-star">&nbsp;*</span></label>

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
                placeholder="Enter Location"
                value={formData.location}
                required
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

            <label className="f-label">Description<span style={{ color: "red" }} className="f-star">&nbsp;*</span></label>
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
              required
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

              <label className="f-label">Coverage Start Date<span style={{ color: "red" }} className="f-star">&nbsp;*</span></label>
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
                required
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

              <label className="f-label">Coverage End Date<span style={{ color: "red" }} className="f-star">&nbsp;*</span></label>
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
                required
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

              <label className="f-label">Strike Value<span style={{ color: "red" }} className="f-star">&nbsp;*</span></label>
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
                required
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

              <label className="f-label">Maximum Buyers<span style={{ color: "red" }} className="f-star">&nbsp;*</span></label>
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
                required
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

              <label className="f-label">Premium Amount<span style={{ color: "red" }} className="f-star">&nbsp;*</span></label>
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
                required
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

              <label className="f-label">Payout Amount<span style={{ color: "red" }} className="f-star">&nbsp;*</span></label>
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
                required
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
            <button type="submit" className="f-btn f-btn-white f-btn-animate" onClick={handleCreate} >
            {showSyncLoader ? (
                <SyncLoader color="black" size={12} speedMultiplier={0.8} />
              ) : (
                <>Create</>
              )}
            </button>


            {showErrorMessage && (
              <div className="error-message">
                Please fill in all required fields.
              </div>
            )}
            </form>

          
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
