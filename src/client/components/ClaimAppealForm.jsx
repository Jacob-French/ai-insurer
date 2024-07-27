import {useRef} from 'react'

export default function ClaimAppealForm({amount, reason, response, makeAppeal}){
  const appealRef = useRef()

  function constructAppeal(){
    const appeal = {
      amount: amount,
      reason: reason,
      assistantResponse: response,
      appeal: appealRef.current.value
    }

    makeAppeal(appeal)
  }

  return(
    <div className="claim-form">
      <h1>Appeal Claim</h1>
      <hr />
      <p><span className="bold-font">Claim Amount:</span> {amount}</p>
      <p><span className="bold-font">Claim Reason:</span> <br/>{reason}</p>
      <p><span className="bold-font">Claim Response:</span> <br/>{response}</p>

      <label htmlFor="appeal">Appeal:</label>
      <textarea id="appeal" ref={appealRef}></textarea>
      <button onClick={constructAppeal}>Make Appeal</button>
    </div>
  )
}