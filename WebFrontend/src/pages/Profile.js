import React, { useEffect, useState } from "react";
import { Api } from "../services/api";

// PUBLIC_INTERFACE
export default function Profile() {
  /** Profile page allowing updates to user profile data. */
  const [profile, setProfile] = useState({ first_name: "", last_name: "", bio: "", phone: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    Api.me().then((u) => {
      setProfile({
        first_name: u.profile?.first_name || "",
        last_name: u.profile?.last_name || "",
        bio: u.profile?.bio || "",
        phone: u.profile?.phone || "",
      });
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await Api.updateProfile(profile);
    setMessage("Profile updated.");
    setTimeout(()=>setMessage(""), 2000);
  };

  return (
    <section>
      <h1>My Profile</h1>
      {message && <p role="status" style={{ color: "green" }}>{message}</p>}
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <label>
          <span>First name</span>
          <input value={profile.first_name} onChange={(e)=>setProfile({...profile, first_name: e.target.value})} />
        </label>
        <label>
          <span>Last name</span>
          <input value={profile.last_name} onChange={(e)=>setProfile({...profile, last_name: e.target.value})} />
        </label>
        <label>
          <span>Bio</span>
          <textarea value={profile.bio} onChange={(e)=>setProfile({...profile, bio: e.target.value})} />
        </label>
        <label>
          <span>Phone</span>
          <input value={profile.phone} onChange={(e)=>setProfile({...profile, phone: e.target.value})} />
        </label>
        <button className="btn">Save</button>
      </form>
    </section>
  );
}
