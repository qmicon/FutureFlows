import React, { useState } from "react";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import styled from "styled-components";
import dotenv from "dotenv"
import Navbar from "../../components/Navbar";
import { buyUSDCwithCard, getCardPaymentStatus, getCryptoTransferStatus, tranferCryptoToWallet } from "utils/USDC";
import LoadingOverlay from 'react-loading-overlay';

dotenv.config({ path: '/path/to/.env' });
const DB = process.env.DB
// const {publicKey , privateKey} = generateKeys();

const InputStyled = styled.input`
padding: .555rem;
font-size: 1rem;
line-height: 1.5;
color: #495057;
background-color: #fff;
background-clip: padding-box;
border: 1px solid #ced4da;
border-radius: .25rem;
transition:ease border-color .15s;
margin-top: 20px;
margin-right: 15px;
`;


const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-top: 100px;
`
const Button = styled.div`
margin-top: 2em;
`

const AddCard = () => {
// const cryptr = new Cryptr('AJSNDXJKASNCJXANDJICCHSUABISWUDQWYDIUYTQWAHDVYUQWGHD');
// const addMutation = useMutation(addUser, {
//   onSuccess: () => {
//     console.log("inserted data")
//   }
// })
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [focus, setFocus] = useState("");
  const [mobNumber, setMobNumber] = useState("");
  const [emailId, setEmailId] = useState("");
  const [loaderText, setLoaderText] = useState("");
  const [loaderactive, setActive] = useState(false)
  const dummyFunction = () => {
      console.log("some function")
  }
  const handleEmailId = (value) => 
  {
    setEmailId(value)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
      const timer = ms => new Promise(res => setTimeout(res, ms))
      setActive(true)
      setLoaderText("Card Payment Initiated")
      let cardRes = await buyUSDCwithCard(amount)
      const cardPayId = cardRes.data.id
      var cardPayStatus = cardRes.data.status
      while(cardPayStatus === "pending") {
        setLoaderText("card payment status pending")
        let statusRes = await getCardPaymentStatus(cardPayId)
        cardPayStatus = statusRes.data.status
        await timer(1000)
      }
      if(cardPayStatus === "confirmed") {
        setLoaderText("card payment status confirmed")
        setLoaderText("crypto transfer to wallet initiated")
        const address = "0xb6c43135316e7dee"
        let cryptoRes = await tranferCryptoToWallet(address, amount)
        const cryptoTransferId= cryptoRes.data.id
        var cryptoPayStatus = cryptoRes.data.status
        while(cryptoPayStatus === "pending") {
          setLoaderText("crypto transfer status pending")
          let statusRes = await getCryptoTransferStatus(cryptoTransferId)
          cryptoPayStatus = statusRes.data.status
          await timer(1000)
        }
        if(cryptoPayStatus === "complete") {
          setLoaderText("crypto transferred, check wallet")
          await timer(2000)
        }
        else {
          setLoaderText("crypto transfer failed")
          await timer(2000)
        }
      }
      else {
        setLoaderText("card payment failed")
        await timer(2000)
      }
      setActive(false)
    }

  return (
    <>
    <LoadingOverlay
        active={loaderactive}
        spinner
        text={loaderText}
        >
          <div style={{display : "flex",justifyContent: "center", alignItems: "center"}}>
    <Navbar/>
    </div>

    <Wrapper>
    <Cards
    number={number}
    name={name}
    expiry = {expiry}
    cvc = {cvc}
    focused = {focus}
    />
      <form onSubmit= {(e) => handleSubmit(e.target.value)} method="POST">
        <InputStyled
          type="tel"
          name="number"
          placeholder="card number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          onFocus={(e) => setFocus(e.target.name)}
          required
        />
        <InputStyled
          type="tel"
          name="Phone Number"
          placeholder="Phone number"
          value={mobNumber}
          onChange={(e) => setMobNumber(e.target.value)}
          required
        />
        <InputStyled
          type="tel"
          name="cvc"
          placeholder="cvc"
          value={cvc}
          onChange={(e) => setCvc(e.target.value)}
          onFocus={(e) => setFocus(e.target.name)}
          required
        />
        <InputStyled
          type="text"
          name="expiry"
          placeholder="MM/YY Expiry"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          onFocus={(e) => setFocus(e.target.name)}
        />
        <InputStyled
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={(e) => setFocus(e.target.name)}
        />
        <InputStyled
          type="text"
          name="Amount"
          placeholder="amount in USD"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onFocus={(e) => setFocus(e.target.name)}
        />

        <input className="bg-green-500 px-6 py-2 rounded-md cursor-pointer" onClick={(e) => handleSubmit(e)} type="submit" value ="submit"/>
      </form>
      </Wrapper>
      </LoadingOverlay>
    </>
  );
};

export default AddCard;
