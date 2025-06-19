import React from 'react';

export default function Cell({alive,onClick}) {
    return (
        <div
            onClick={onClick}
            style={{
                width: 20,
                height: 20,
                backgroundColor: alive ? '#4caf50': undefined,
                border: 'solid 1px #ccc'
            }}
        />
    );
}
