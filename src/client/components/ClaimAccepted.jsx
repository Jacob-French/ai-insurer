

export default function ClaimAccepted({explanation, newClaim}){

  return(
    <div className="claim-form">
      <h1 className="green">Claim Accepted</h1>
      <hr />
      <label>Message:</label>
      <div className="textbox">
        <p>
          {explanation}
        </p>
      </div>
      <button onClick={newClaim}>New Claim</button>
    </div>
  )
}