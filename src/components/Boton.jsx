import * as React from 'react';


function Boton(Props){

    const {children,isLoading,onClick} = Props;

    return (
        <button 
            onClick={onClick}
            disabled={isLoading}
            type="button"
            className={`btn btn-${isLoading ? 'primary' : 'secondary'}`}
        >
            {children}
        </button>
    )

}

export default Boton;
{/*button type="button" class="btn btn-secondary">Secondary</button>*/}