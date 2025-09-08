import React,{useEffect, useState} from "react";
import SopList from "../Components/Sopvideos/SopList"; // ✅ check correct path
import { baseurl } from "../constants";
import {ClipLoader} from "react-spinners"

const sopData = [
  {
    product: "Product A",
    title: "Installation Guide",
    type: "document",
    url: "https://drive.google.com/your-doc-link"
  },
  {
    product: "Product A",
    title: "Demo Video",
    type: "video",
    url: "https://drive.google.com/drive/folders/1JGZbIS053Y6o5gPzZ3Yg_-7vvQBPPM6u?usp=drive_link"
  },
  {
    product: "Product B",
    title: "Wiring SOP",
    type: "document",
    url: "https://drive.google.com/your-doc-link"
  }
];

export default function SopScreen() {

      const [sops,setSops] = useState([]);
      const [loader,setLoader] = useState(false);

      useEffect(() => {
          async function fetchData() {
            try {
              setLoader(true);
              const res = await fetch(`${baseurl}/api/sop`);
              const data = await res.json();
              setSops(data);
              console.log("SOPs state:", sops);
            } catch (err) {
              console.error("Failed to fetch SOPs:", err);
            }
            finally{
              setLoader(false);
            }
          }
          fetchData();
        }, []);
  return (
    <div className="">
      <h1 className="text-xl font-bold mb-4 Heading d-flex justify-content-center align-items-center">SOP Documents & Videos</h1>
      <div className={`${loader ? "d-flex flex-column h-100 align-items-center justify-contrent-center" : ""}`}>
          {loader ? <ClipLoader loading={loader} size={50} /> :<SopList data={sops} />}
      </div>
    </div>
  );
}
