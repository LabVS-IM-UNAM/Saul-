import * as React from "react";

function Boton(Props) {
  const { children, isLoading, onClick } = Props;

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      type="button"
      className={`btn btn-${isLoading ? "secondary" : "primary"}`}
    >
      {isLoading ? "Cargando..." : children}
    </button>
  );
}

export default Boton;
