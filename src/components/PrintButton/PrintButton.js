import './_print-button.scss';
import React from 'react';
import { Button } from '@carbon/react';
import { Printer } from '@carbon/icons-react';



const PrintButton = (props) => {
    return (
        <Button renderIcon={Printer} iconDescription="printer" onClick={props.onClick} size={props.size}>Print</Button>
    )
}

export default PrintButton