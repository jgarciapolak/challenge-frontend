// importo los estilos del Login
import './Login.css';
// useState permite settear variables
import React, { useState } from "react";
// axios es un Cliente HTTP que permite hacer llamadas al backend
import axios from 'axios';
// apiURL es la url del backend
import { apiURL } from '../../config';
// useNavigate me permite navegar entre las diferentes rutas programáticamente
import { useNavigate } from 'react-router-dom';

function Login() {
  // declaro las variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const navigate = useNavigate();

  // función para validar que el email sea válido
  const validateEmail = (email) => {
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    return false;
  };

  // función que valida el email, en caso de ser incorrecto muestra el error, en caso de ser correcto muestra el input de la password
  const nextHandler = () => {
    // valido el email
    if(validateEmail(email)){
      // si es válido remuevo el error por si había uno
      setError("");
      let body = {
        email: email
      };
      // endpoint para validar si existe el email en la base de datos
      axios
        .post(apiURL + "/api/auth/validEmail", body)
        .then(function(response) {
          // email existe, muestro el input de la password
          console.log(response);
          setMostrarPassword(true);
        })
        .catch(function(error) {
          // email no existe, muestro error
          console.log(error);
          if(error.response.status === 404){
            setError("Usuario inexistente");
          }else{
            setError("Error reintente");
          }
        });
    }else{
      // email inválido, muestro error
      setError("Email inválido");
    }
  };

  // función para realizar el login
  const loginHandler = () => {
    let body = {
      email: email,
      password: password
    };
    // endpoint del login
    axios
      .post(apiURL + "/api/auth/signin", body)
      .then(function(response) {
        // login correcto, guardo el token de manera local para que no se pierda al refrescar la página y redirijo al home
        console.log("Login correcto");
        localStorage.setItem('token', response.data.accessToken)
        navigate('/');
      })
      .catch(function(error) {
        console.log(error);
        // login incorrecto, muestro el error correspondiente
        if(error.response.status === 404){
          setError("Usuario inexistente");
        }else if(error.response.status === 401){
          setError("Credenciales incorrectas");
        }else {
          setError("Error reintente");
        }
      });
  };

  // función para ejecutar el login al presionar Enter
  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      loginHandler();
    }
  }

  // botones de continuar y login, muestro uno u otro dependiendo de si el email está validado o no
  const NextBtn = () => (
    <button className='login-btn' onClick={nextHandler}>Continuar</button>
  );

  const LoginBtn = () => (
    <button className='login-btn' onClick={loginHandler}>Login</button>
  );

  // render del html del login
  return (
    <div>
      <div className='login'>
        <div className='login-card'>
          <h2>Log in to your account</h2>
          <label className='login-error'>{error}</label>
          <div className='login-row'>
            <label className='login-label' htmlFor="email">Email Address</label>
            <input className='login-input' id="email" type="text" placeholder='Ingrese email' 
            value={email}
            onChange={e => setEmail(e.currentTarget.value)}></input>
          </div>
          {mostrarPassword ? 
            <div className='login-row'>
              <label className='login-label' htmlFor="password">Password</label>
              <input className='login-input' id="password" type="password" onChange={e => setPassword(e.currentTarget.value)} onKeyPress={handleKeyPress}></input>
            </div> : ''}
          {mostrarPassword === false ? <NextBtn /> : <LoginBtn />}
        </div>
      </div>
    </div>
  );
}

export default Login;
