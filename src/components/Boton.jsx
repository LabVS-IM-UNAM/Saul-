import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Componente Botón reutilizable con Bootstrap
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onClick - Función que se ejecutará al hacer clic
 * @param {string} props.text - Texto que se mostrará en el botón
 * @param {string} props.color - Color del botón (primary, secondary, success, danger, warning, info, light, dark)
 * @param {string} [props.size] - Tamaño del botón (sm, lg)
 * @param {string} [props.className] - Clases adicionales
 * @param {boolean} [props.outline] - Si es true, usa el estilo outline
 * @param {boolean} [props.disabled] - Si el botón está deshabilitado
 */
function Boton({
  onClick, 
  text, 
  color = 'primary', 
  size = '', 
  className = '', 
  outline = false,
  disabled = false,
  ...rest 
}) {
  // Construir la clase del botón
  const botonClass = `btn ${outline ? 'btn-outline-' : 'btn-'}${color} ${size ? 'btn-' + size : ''} ${className}`;

  return (
    <boton
      type="button"
      className={botonClass}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {text}
    </boton>
  );
}

export default Boton;