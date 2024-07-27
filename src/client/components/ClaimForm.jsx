import {useRef} from 'react'

export default function ClaimForm({makeClaim}){
  const claimAmount = useRef()
  const claimReason = useRef()

  function constructClaim(){
    const claim = {
      amount: claimAmount.current.value,
      reason: claimReason.current.value
    }

    makeClaim(claim)
  }

  return(
    <div className="claim-form">
      <h1>Insurance Claim</h1>
      <hr />
      <label htmlFor="claim-amount">Claim Amount:</label>
      <input type="text" id="claim-amount" ref={claimAmount}></input>
      <label htmlFor="reason">Reason:</label>
      <textarea id="reason" ref={claimReason}></textarea>
      <button onClick={constructClaim}>Claim</button>
    </div>
  )
}