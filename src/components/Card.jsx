import * as React from 'react';

function Card(props) {
    const {children} = props;
    return(
        <div className="card" style={{width:'350px'}}>
            <div className="card-body">{children}</div>
        </div>
        )
}

export function CardBody(props){
    const {title,text} = props;
    return(
        <>
            <h5 className="card-title">{title}</h5>
            <h6 className="card-subtitle mb-2 text-body-secondary">Card subtitle</h6>
            <p className="card-text">{text}</p>
        </>

    );
}

export default Card;