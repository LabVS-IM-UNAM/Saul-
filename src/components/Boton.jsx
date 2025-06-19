import React from 'react';

function Boton(params) {
  const {children,isLoading,onClick} = params; 

  return(
    <button
      onClick={onClick}
      disabled={isLoading}
      type="button"
      className={`btn btn-${isLoading? 'secondary' : 'primary'}`}
    >
      {isLoading ? "Cargando.." : children}
    </button>
  );
}

export default Boton;
