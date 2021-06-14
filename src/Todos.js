import React,{useContext} from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import {CredentialsContext} from './App';
function Todos({list}){
  const [credentials] = useContext(CredentialsContext);
  fetch(`https://servervishnu.herokuapp.com/todos`,{
    method: 'POST',
    headers: {"Content-Type":"application/json",
    Authorization:`Basic ${credentials.username}:${credentials.userid}:${credentials.password}`
  },
  body: JSON.stringify(list),
})
.then(()=>{})
  return(<div></div>);
}

export default Todos;
