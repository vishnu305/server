import React,{useState,useContext} from 'react';
import { useHistory } from 'react-router-dom';
import { CredentialsContext } from './App';
const handleErrors = async (response) => {
  if(!response.ok){
    const {message} = await response.json();
    throw Error(message);
  }
  return response.json();
}
function Login(){
  const history = useHistory()
  const [username, setusername]=useState("");
  const [userid, setuserid]=useState("");
  const [password, setpassword]=useState("");
  const [,setcredentials] = useContext(CredentialsContext);
  const [error,setError]=useState("");
  const login=(e)=>{
    e.preventDefault();
    fetch(`https://servervishnu.herokuapp.com/login`,{
      method: 'POST',
      headers: {"Content-Type":"application/json",
    },
    body: JSON.stringify({
      username,
      userid,
      password,
    }),
  })
  .then(handleErrors)
  .then(()=>{
    setcredentials({username,userid,password})
    history.push("/inbox");
  })
  .catch((error)=>{
    console.log(error);
    setError(error.message);
  })
};
  return(<div className="registercontainer">
    <h1>Login</h1>
    {error}
    <form onSubmit={login}>
      <input onChange={(e)=>setusername(e.target.value)} placeholder="Enter Full Name" />
      <br />
      <input onChange={(e)=>setuserid(e.target.value)} placeholder="Enter Email id" />
      <br />
      <input type="password" onChange={(e)=>setpassword(e.target.value)} placeholder="Password" />
      <br />
      <button type="submit">Login</button>
    </form>
    </div>)
}

export default Login;
