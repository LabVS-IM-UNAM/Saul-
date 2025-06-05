import React from 'react';

function Card(props) {
    const { children, style } = props

    return (
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '20px',
          width: 'fit-content', // Ajusta el ancho al contenido
          maxWidth: '90%', // Asegura que no sea demasiado ancho
          margin: 'auto',
          ...style // Permite estilos personalizados adicionales
        }}>
      {children}
    </div>
    );
}

function CardBody(props) {
    const { title,subtitle, text } = props
    return (
        <div style={{
          marginBottom: '15px',
          textAlign: 'center'
        }}>
            <h2>{title}</h2>
            <h3>{subtitle}</h3>
            <p>{text}</p>
        </div>
  );
}

export { CardBody };
export default Card;