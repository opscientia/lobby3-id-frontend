import { useState, useEffect } from 'react'
import { useAccount, useSignMessage } from 'wagmi'

const ReturnButton = (props) => {
  const { data: account } = useAccount();
  const { data, error, isLoading, signMessage } = useSignMessage({
    onSuccess(data, variables) {
      console.log('successful signature')
      console.log('')
      window.location.href = `http://localhost:3000/register?address=${account.address}&signature=${data}`;
    },
  })
  // const [redirectingSiteUrl, setRedirectingSiteUrl] = useState()

  // useEffect(() => {
  //   const siteUrlTemp = sessionStorage.getItem('signUpWithHoloSiteUrl')
  //   if (siteUrlTemp) {
  //     setRedirectingSiteUrl(siteUrlTemp)
  //   }
  // }, [props])

  // Get secret message to sign from server
  async function getSecretMessage() {
    const resp = await fetch(
      `http://localhost:3000/initialize?address=${account.address}`
    )
    return (await resp.json()).message
  }

  async function handleClick() {
    // sessionStorage.removeItem('signUpWithHoloSiteUrl');
    const msg = await getSecretMessage()
    signMessage({message: msg})
  }

  return (
    <>
      <div onClick={handleClick} className="return-button x-button secondary">
        <div className="wallet-text">
          Verify yourself
        </div>
      </div>
    </>
  );
};

export default ReturnButton;
