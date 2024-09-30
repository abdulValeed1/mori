import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { ArrowRight, ArrowDown } from 'lucide-react';
// import { useApp } from "context/AppContext";
import ResultCard from "components/Result/ResultCard"
import useAxios from "hooks/useAxios";

function Result({step, resultValues}) {
  
    const navigate = useNavigate();
    const { getCall } = useAxios()
    // const { resultValues } = useApp();

    const generateAndDownloadPPT = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/generate-ppt",
          {
            responseType: "blob", // Important: This tells axios to treat the response as binary data
          }
        );
  
        // Create a Blob from the response data
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        });
  
        // Create a link element and trigger the download
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "presentation.pptx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error generating PPT:", error);
      }
    };

    const handleSubmit = () => {
        if(step === 1){
            navigate("/ai-responsible-use")
        } else {
            navigate("/ai-tech-enablement")
        }
    }

    return (
        <div className="h-full overflow-y-auto w-full p-6 bg-gray-800 bg-opacity-30 rounded-lg backdrop-blur-sm overflow-hidden">
          {/* <div className="h-full w-full overflow-y-auto p-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl"> */}
            {
              resultValues.map((currentArea, index) => (
                <ResultCard key={index} currentArea={currentArea} step={step} />
              ))
            }
          {/* </div> */}
            {step !== 3 ? <button 
                className={`w-full space-x-2 p-2 rounded-lg border transition duration-200 flex items-center justify-center mb-4
                    bg-white text-dusky-teal hover:bg-light-gray hover:text-primary hover:border-2 hover:border-primary hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] cursor-pointer`}
                  onClick={handleSubmit}
                >
                Go To the Next Step
                <ArrowRight size={20} className="ml-2" />
            </button> : 
            <button 
            className={`w-full space-x-2 p-2 rounded-lg border transition duration-200 flex items-center justify-center mb-4
                bg-white text-dusky-teal hover:bg-light-gray hover:text-primary hover:border-2 hover:border-primary hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] cursor-pointer`}
              onClick={generateAndDownloadPPT}
            >
            Download
            <ArrowDown size={20} className="ml-2" />
        </button> }
        </div>
    );
}

export default Result