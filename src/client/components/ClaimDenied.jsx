

export default function ClaimDenied({explanation, appealClaim, newClaim, appealUsed}){

  return(
    <div className="claim-form">
      <h1 className="red">Claim Denied</h1>
      <hr />
      <label>Message:</label>
      <div className="textbox">
        <p>
          {explanation}
        </p>
      </div>
      {!appealUsed && <button onClick={appealClaim}>Appeal</button>}
      {appealUsed && <button>This decision is final.</button>}
      <button onClick={newClaim}>New Claim</button>
    </div>
  )
}