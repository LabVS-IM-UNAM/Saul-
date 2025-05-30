import * as React from 'react';
import {useState} from "react";

function List(Props) {
    const [index, setIndex] = useState(1);
    const {data,onSelect} = Props;
    const handlerClick = (i,elemento) => {
        setIndex(i);
        onSelect(elemento);
    };
    return (
        <ul className="list-group">
            {data.map((elemento,i) =>
                <li
                    onClick={() => handlerClick(i,elemento)} key={elemento} className={`list-group-item ${index == i ? 'active': ''}`}
                >
                    {elemento}
                </li>)}
        </ul>
    )

}

export default List;
