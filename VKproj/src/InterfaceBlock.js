import React from 'react';

export default function ({enabled = false}) {
    return (
        <div className={enabled ? "interface-block-enabled" : "interface-block-disabled"} />
    );
}