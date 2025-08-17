// src/components/ControlGroup.jsx/

import React from 'react';

function ControlGroup({label,htmlFor,children}) {
    return(
        <div className="control-group">
            <label htmlFor={htmlFor}>{label}</label>
            {/* children es un prop especial que renderiza lo que se pase en la etiqueta*/}
            {children}
        </div>
    );
}

export default ControlGroup;