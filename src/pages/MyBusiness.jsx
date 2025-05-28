import React from "react";
import "../styles/MyBusiness.css";
import { images } from "../constants/links";

const MyBusiness = () => {
  return (
    <div className="cards-container">
      {/* Business Details Card */}
      <div className="card business-details">
        <h2>Your business details. To update them - just change them.</h2>
        <div className="input-group">
          <label>Name</label>
          <input type="text" defaultValue="Dartix" />
        </div>
        <div className="input-group">
          <label>Address</label>
          <input
            type="text"
            defaultValue="203, Sujata Niwas, Dhangarh Sarai Chhiva"
          />
        </div>
        <div className="input-group">
          <label>Address 2</label>
          <input type="text" placeholder="Enter Address 2" />
        </div>
        <div className="input-group inline-group">
          <div>
            <label>Postcode</label>
            <input type="text" defaultValue="11149" />
          </div>
          <div>
            <label>City</label>
            <input type="text" defaultValue="Pratapgarh" />
          </div>
        </div>
        <div className="input-group">
          <label>Our reference</label>
          <input type="text" defaultValue="Devesh Maurya" />
        </div>
        <div className="input-group">
          <label>Phone</label>
          <input type="text" defaultValue="09670551347" />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input type="email" defaultValue="deveshmaurya1996@gmail.com" />
        </div>
        <div className="input-group">
          <label>Account nr.</label>
          <input type="text" placeholder="Enter account number" />
        </div>
        <div className="input-group">
          <label>Org. number</label>
          <input type="text" placeholder="Enter org number" />
        </div>
        <div className="input-group">
          <label>Homepage</label>
          <input type="text" placeholder="Will not show on invoice if empty" />
        </div>
        <p>
          Click <a href="#">Settings</a> to choose invoice number to start with
          and other settings.
        </p>
      </div>

      {/* Logo and Profile Picture Card */}
      <div className="card logo-profile">
        <h2>Our Logo</h2>
        <div className="logo-section">
          <img src="/branding.jpeg" alt="Logo" className="branding" />
          <span>Ert Företagsnamn AB</span>
        </div>
        <div className="button-group">
          <button className="toggle-btn active">Yes</button>
          <button className="toggle-btn">No</button>
        </div>
        <div className="button-group">
          <button className="action-btn">Choose logo</button>
          <button className="action-btn">Upload new</button>
        </div>
        <button className="preview-btn">Preview logo</button>

        <h2>Profile picture</h2>
        <div className="profile-section">
          <img src={images.logo} alt="Profile Picture" />
        </div>
        <div className="button-group">
          <button className="action-btn">Edit Original</button>
          <button className="action-btn">Upload new</button>
        </div>
      </div>
    </div>
  );
};

export default MyBusiness;
