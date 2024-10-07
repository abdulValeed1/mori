import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAxios from "hooks/useAxios";
import { toast } from 'react-toastify';
import Breadcrumb from "components/Breadcrumb/Breadcrumb";
import Result from "components/Result/Result";
import { useApp } from "context/AppContext";

const AITechEnablement = () => {
  const { postCall } = useAxios();
  const { techEnableValues } = useApp();
  const [currentArea, setCurrentArea] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [techEnablementAreas, setTechEnablementAreas] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [FinalresultValues, setFinalResultValues] = useState([])

  const handleSelectChange = (assessmentIndex, questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [assessmentIndex]: {
        ...(prev[assessmentIndex] || {}),
        [questionId]: value
      }
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Submitted answers:', answers);
    setShowResult(true);
    const result = await postCall("save-tech-reasoning", answers);
      if(result.success){
        setFinalResultValues(result.data)
        setShowResult(true)
      } else {
        toast.warn(`${result.error}`)
      }
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const isCurrentAssessmentComplete = () => {
    const currentAnswers = answers[currentArea] || {};
    return techEnablementAreas[currentArea]?.questions.every(q => currentAnswers[q.id]) ?? false;
  };

  const canProceed =  currentArea < (techEnablementAreas.length - 1) && isCurrentAssessmentComplete();
  const canSubmit = currentArea === (techEnablementAreas.length - 1) && isCurrentAssessmentComplete();

  useEffect(()=>{
    setTechEnablementAreas(techEnableValues);
  },[techEnableValues])

  if (techEnablementAreas.length === 0) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Breadcrumb pageName="AI Tech Enablement"/>
      {!showResult ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-primary text-white p-4">
              <h2 className="text-xl font-bold">{techEnablementAreas[currentArea]?.title}</h2>
              <p className="text-sm text-light-gray">
                Step {currentArea + 1} of {techEnablementAreas.length}
              </p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {techEnablementAreas[currentArea]?.defaultInfo.map((item, index) => (
                  <motion.div 
                    key={index}
                    className="bg-light-gray p-2 rounded-md shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                  >
                    <div className="flex items-center mb-1">
                      <span className="mr-1 text-lg">{item.icon}</span>
                      <h4 className="font-semibold text-sm text-primary">{item.title}</h4>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.options.map((option, optIndex) => (
                        <span key={optIndex} className={`px-1 py-0.5 rounded text-xs ${ option.selected ? 'bg-primary text-light-gray' : 'text-primary bg-white'} `}>
                          {option.value}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <h3 className="font-semibold text-md text-primary mb-3">Reasoning statements</h3>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentArea}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {techEnablementAreas[currentArea]?.questions.map((question, index) => (
                      <motion.div 
                        key={question.id} 
                        className="space-y-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.5 }}
                      >
                        <label htmlFor={question.id} className="block text-sm font-medium text-dusky-teal">{question.label}</label>
                        <select 
                          id={question.id}
                          onChange={(e) => handleSelectChange(currentArea, question.id, e.target.value)}
                          className="w-full p-2 text-sm text-left shadow-sm bg-white border border-primary rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="">Select an option</option>
                          {question.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </motion.div>
                    ))}
                  </form>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="bg-light-gray px-4 py-3 flex justify-between">
              <button 
                onClick={() => setCurrentArea(prev => prev - 1)}
                disabled={currentArea === 0}
                className="bg-white text-primary hover:bg-warm-red hover:text-white px-3 py-1 rounded text-sm disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-primary"
              >
                ← Previous
              </button>
              {canSubmit ? (
                <button 
                  onClick={handleSubmit} 
                  className="bg-primary text-white hover:bg-warm-red px-3 py-1 rounded text-sm disabled:opacity-50"
                  disabled={isSubmitting || isSubmitted}
                >
                  {isSubmitting ? 'Submitting...' : isSubmitted ? 'Submitted' : 'Submit'}
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentArea(prev => prev + 1)}
                  disabled={!canProceed}
                  className="bg-primary text-white hover:bg-warm-red px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ): <Result step={3} resultValues={FinalresultValues}/>
      }
    </>
    
  );
};

export default AITechEnablement;