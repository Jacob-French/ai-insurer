import {useEffect, useState} from 'react'
import ClaimForm from './ClaimForm'
import './Interface.css'
import ClaimAccepted from './ClaimAccepted'
import ClaimDenied from './ClaimDenied'
import ClaimInProgress from './ClaimInProgress'
import ClaimAppealForm from './ClaimAppealForm'

export default function Interface(){
  const [formType, setFormType] = useState("claim-form")
  const [explanation, setExplanation] = useState("")
  const [boxShadow, setBoxShadow] = useState({boxShadow: "0px 0px 5px rgba(128, 0, 128, 0.236)"})
  const [currentClaim, setCurrentClaim] = useState(null)
  const [currentResponse, setCurrentResponse] = useState("")
  const [appealUsed, setAppealUsed] = useState(false)
  const BACK_END_URL = import.meta.env.VITE_BACK_END_URL
  
  function makeClaim(claim){
    const fetchData = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(claim)
    }

    console.log("test1")
    console.log("back end: " + BACK_END_URL)
    console.log("test2")

    try{
      fetch(`${BACK_END_URL}/openAi/claim`, fetchData)
      .then(response => response.json())
      .then((json) => {
        if(json.decision === 'accept'){
          setFormType("claim-accepted")
          setExplanation(json.explanation)
          setBoxShadow({boxShadow: "0px 0px 5px rgb(109, 255, 109)"})
        }
        else if(json.decision === "deny"){
          setFormType("claim-denied")
          setExplanation(json.explanation)
          setBoxShadow({boxShadow: "0px 0px 5px rgb(255, 129, 129)"})
        }
        setCurrentResponse(json.explanation)
      })

      setCurrentClaim(claim)
    }
    catch(error){
      error.log("There was an error connecting to the server: ", error)
    }

    setFormType("claim-in-progress")
  }

  function makeAppeal(appeal){
    const fetchData = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appeal)
    }

    try{
      fetch(`${BACK_END_URL}/openAi/appeal`, fetchData)
        .then(response => response.json())
        .then((json) => {
          if(json.decision === "accept"){
            setFormType("claim-accepted")
            setExplanation(json.explanation)
            setBoxShadow({boxShadow: "0px 0px 5px rgb(109, 255, 109)"})
          }
          else if(json.decision === "deny"){
            setFormType("claim-denied")
            setExplanation(json.explanation)
            setBoxShadow({boxShadow: "0px 0px 5px rgb(255, 129, 129)"})
            setAppealUsed(true)
          }
        })
    }
    catch(error){
      error.log("There was an error connecting to the server: ", error)
    }

    setFormType("claim-in-progress")
  }

  function appealClaim(){
    setFormType("claim-appeal-form")
    setBoxShadow({boxShadow: "0px 0px 5px rgba(128, 0, 128, 0.236)"})
  }

  function newClaim(){
    setAppealUsed(false)
    setFormType("claim-form")
    setBoxShadow({boxShadow: "0px 0px 5px rgba(128, 0, 128, 0.236)"})
  }

  return(
    <div className="interface" style={boxShadow}>
      {formType === "claim-form" && <ClaimForm makeClaim={makeClaim} />}

      {formType === "claim-accepted" && <ClaimAccepted explanation={explanation} newClaim={newClaim} />}

      {formType === "claim-denied" && <ClaimDenied 
        explanation={explanation} appealClaim={appealClaim} 
        newClaim={newClaim} 
        appealUsed={appealUsed} 
      />}
      
      {formType === "claim-in-progress" && <ClaimInProgress />}

      {formType === "claim-appeal-form" && <ClaimAppealForm 
        amount={currentClaim.amount} 
        reason={currentClaim.reason}
        response={currentResponse}
        makeAppeal={makeAppeal}
      />}
    </div>
  )
}