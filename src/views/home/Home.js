// importo los estilos del Home
import './Home.css';
// useState permite settear variables
// useEffect permite llevar a cabo efectos secundarios en componentes, se ejecuta en cada render
import React, { useState, useEffect } from "react";
// useNavigate me permite navegar entre las diferentes rutas programáticamente
import { useNavigate } from "react-router-dom";
// axios es un Cliente HTTP que permite hacer llamadas al backend
import axios from 'axios';
// apiURL es la url del backend
import { apiURL } from '../../config';

const Home = (props) => {
  // declaro las variables
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({});
  const [error, setError] = useState("");

  // de haber token pido la información del usuario, de no haber token redirijo al login, de dar error el token muestro el error
  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token == null){
      navigate("/login")
    }else{
      axios.defaults.headers.common['x-access-token'] = token;
      // endpoint del backend que devuelve la información del usuario logueado según el token
      axios
        .get(apiURL + "/api/v0/users/me")
        .then(function(response) {
          console.log(response);
          setUsuario(response.data);
        })
        .catch(function(error) {
          console.log(error);
          if(error.response.status === 401){
            setError("Token inválido");
          }else {
            setError("Error reintente");
          }
        });
    }
  }, []);

  // función de logout, borro el token y redirijo al login
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/login")
  }

  // render del html del home
  return (
    <div>
      <h1 className='home-usuario-title'>Bienvenido!</h1>
      <label className='home-error'>{error}</label>
      <div className="home-usuario-card">
        <img className='home-usuario-img' src={usuario.avatar}></img>
        <div>
          <h2>Datos:</h2>
          <label className='home-usuario-data'>Nombre: {usuario.name}</label>
          <label className='home-usuario-data'>Apellido: {usuario.surname}</label>
          <label className='home-usuario-data'>Email: {usuario.email}</label>
          <label className='home-usuario-data'>Edad: {usuario.age}</label>
          <label className='home-usuario-data'>Rol: {usuario.role}</label>
        </div>
      </div>
      <button className='home-logout' onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;