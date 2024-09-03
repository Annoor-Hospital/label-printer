import './_nav-header.scss';
import React from 'react';

import {Link as CarbonLink} from '@carbon/react';

import { 
    Dropdown,
    Header,
    HeaderContainer,
    HeaderName,
    HeaderSideNavItems,
    HeaderGlobalBar,
    HeaderNavigation,
    HeaderMenuButton,
    HeaderMenuItem,
    SideNav,
    SideNavItems,
} from '@carbon/react';


import { Link } from 'react-router-dom';

import { Home } from '@carbon/icons-react';



const printers = [
    {
        text: 'Nurses Office Label Printer',
        ip: '10.10.10.132',
    },
    {
        text: 'Maintenance Label Printer',
        ip:'10.10.10.133',
    },
    {
        text: 'Admin Label Printer',
        ip: '10.10.10.134',
    },
    {
        text: 'Laboratory Label Printer',
        ip: '10.10.10.135',
    },
]


// We bring in props for our parent function to update printer IP
const NavHeader = (props) => {

    const handleChangePrinter = (e) => {
        console.log("Settting Printer to " + e.selectedItem.text);
        var printerIP = e.selectedItem.ip;
        props.onDataChange(printerIP);
    }

    const getPrinter = (printerIP) => {
        const printer = printers.find(({ ip }) => ip === printerIP);
        return printer;
    };
  

    return (
        <>
        <HeaderContainer render={({
            isSideNavExpanded, onClickSideNavExpand
        }) => <Header aria-label="Annoor Label Printer">
                <HeaderMenuButton aria-label={isSideNavExpanded ? 'Close menu' : 'Open menu'} onClick={onClickSideNavExpand} isActive={isSideNavExpanded} aria-expanded={isSideNavExpanded} />
                <CarbonLink href={process.env.REACT_APP_PARENT_PAGE_URL}  renderIcon={Home} />
                <HeaderName as={Link} to="/" prefix="Annoor">Label Printer</HeaderName>
                <HeaderNavigation aria-label="Label Printer">
                    <HeaderMenuItem as={Link} to="/patient_search">Patient Search</HeaderMenuItem>
                    <HeaderMenuItem as={Link} to="/custom_print">Design Custom Print</HeaderMenuItem>
                    <HeaderMenuItem as={Link} to="/lab_order_patients">Lab Orders</HeaderMenuItem>

                {/*    <HeaderMenuItem as={Link} to="/history">History</HeaderMenuItem> */}

                </HeaderNavigation>
                {/* 
                <HeaderGlobalBar>
                    <Dropdown
                        className="printer-dropdown"
                        id="printer-select"
                        label=" Select Printer"
                        type="inline"
                        onChange={handleChangePrinter}
                        items={printers}
                        itemToString={item => item ? item.text : ''}
                        selectedItem={props.data ? getPrinter(props.data) : ''} />
                </HeaderGlobalBar>
                */}
                <SideNav aria-label="Side navigation" expanded={isSideNavExpanded} isPersistent={false} onOverlayClick={onClickSideNavExpand} href="#main-content" onSideNavBlur={onClickSideNavExpand} isRail>
                    <SideNavItems>
                        {isSideNavExpanded && <HeaderSideNavItems hasDivider={true}>
                            <HeaderMenuItem as={Link} to="/patient_search">Patient Search</HeaderMenuItem>
                            <HeaderMenuItem as={Link} to="/custom_print">Design Custom Print</HeaderMenuItem>
                            <HeaderMenuItem as={Link} to="/lab_order_patients">Lab Orders</HeaderMenuItem>

                            <HeaderMenuItem></HeaderMenuItem>
                        </HeaderSideNavItems>}
                    </SideNavItems>
                </SideNav>
            </Header>} />
            </>
    );
}

export default NavHeader;