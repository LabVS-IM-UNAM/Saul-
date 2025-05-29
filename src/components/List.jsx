import * as React from 'react';

function List(Props) {
    const {data} = Props;
    return (
        <ul className="list-group">
            {data.map(elemento =><li className="list-group-item">{elemento}</li>)}
        </ul>
    )

}

export default List;
