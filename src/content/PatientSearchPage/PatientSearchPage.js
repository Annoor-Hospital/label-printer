import './_patient-search-page.scss';
import PatientTable from '../../components/PatientTable';
import React, { useEffect, useState } from 'react';
import { DataTableSkeleton } from '@carbon/react';


//import PrintButton from '../../components/PrintButton';
import PrintDialog from '../../components/PrintDialog/PrintDialog';

const headers=[
    {
        key: 'patient_id',
        header: 'Patient Identifier',
    },
    {
        key: 'local_name',
        header: 'Local Name',
    },
    {
        key: 'age',
        header: 'Age',
    },
    {
        key: 'display_name',
        header: 'Display Name',
    },
    {
        key: 'gender',
        header: 'Gender',
    },
    {
        key: 'print',
        header: 'Print Label',
    },
];

const getRowItems = (row) => {

        let new_patient_dict = {};
        new_patient_dict = {
                id: row.uuid,
                patient_id: row.display.split('-')[0],
                local_name:'N/A',
                //local_name: patientDict.attributes.display.split('=')[1],
                age: row.person.age,
                display_name: row.person.display,
                gender: row.person.gender,
                print: <PrintDialog line1={row.display.split('-')[0]} line2={row.person.display} line3={row.person.gender + " | " + row.person.age} line4={new Date().toLocaleString()}/>,
            }
        
        if (row['person']){
            if (row['person']['attributes']) {
                if (row['person']['attributes'].length > 0) {
                    new_patient_dict = {
                        id: row.uuid,
                        patient_id: row.display.split('-')[0],
                        //local_name:'N/A',
                        local_name: row.person.attributes[0].display.split('=')[1],
                        age: row.person.age,
                        display_name: row.person.display,
                        gender: row.person.gender,
                        print: <PrintDialog line1={row.display.split('-')[0]} line2={row.person.display} line3={row.person.gender + " | " + row.person.age} line4={new Date().toLocaleString()}/>,
                    }
                }
            }
        }
        return new_patient_dict;
        
    }



const PatientSearchPage = () => {
    const [loading, setLoading] = useState(false);
    //const [error, setError] = useState();
    const [rows, setRows] = useState([]);
    const [searchTerm,setSearchTerm] = useState('');
    const [searched,setSearched] = useState(false);

    const retrieveSearchTerm = (searchValue) => {
        //console.log("Setting search term to: ", searchValue);
        setSearched(false); // When we get a new call from the table to search, we want to set the term's searched status to false (since it's new) and change the search term
        setSearchTerm(searchValue);
        
    }

    useEffect(() => {
        async function getPatientList() {
            let patient_list = [];
            const requestHeaders = new Headers();
            console.log("Searching for patients with term: ",searchTerm);
            requestHeaders.append("Authorization", "Basic " + btoa( process.env.REACT_APP_API_USER + ':' + process.env.REACT_APP_API_PASS));
            const requestOptions = {
                method: 'GET',
                headers: requestHeaders,
                redirect: 'follow',
                accept: "application/json",
            };
            console.log(process.env);
            const url = "https://" + process.env.REACT_APP_BAHMNI_HOST + "/" + process.env.REACT_APP_OPENMRS_API_PATH + "/patient?q=" + encodeURIComponent(searchTerm) + "&limit=10";
            console.log(url);
            const data = await fetch( url, requestOptions );
            const result_dict = await data.json();
            console.log("Returned result count: ", result_dict["results"].length);
            for (let i=0; i < result_dict['results'].length; i++) {
                console.log(result_dict['results'][i]);
                let uuid = result_dict['results'][i]['uuid']
                // const url = result_dict['results'][i]['links'][0]['uri'].replace('http://','https://');
                const url = "https://" + process.env.REACT_APP_BAHMNI_HOST + "/" + process.env.REACT_APP_OPENMRS_API_PATH + "/patient/" + uuid;
                console.log("Fetching URL, ",url);
                const patient_details = await fetch( url, requestOptions )
                let patient_details_dict = await patient_details.json();
                if (patient_details_dict['error'] ){
                    console.error("Error code fetching: ", patient_details_dict['error']);
                }
                else {
                    console.log("Fetched patient",patient_details_dict);
                    patient_list.push(getRowItems(patient_details_dict));
                }
            }            
            setLoading(false);
            setRows(patient_list);
            setSearched(true);
            return patient_list;
        }
    if (! searched && searchTerm) {    
        if (searchTerm.length >= 3) {
            getPatientList();
        }
    };
    },[searchTerm,searched])
    //console.log("Rows value: ", rows);
    if (loading) {
        return (
            <DataTableSkeleton columnCount={headers.length + 1} rowCount={10} headers={headers}/>
        )
    }
    return (
        <>
        <PatientTable headers={headers} rows={rows} searchAction={retrieveSearchTerm} />
        </>
    );

}



export default PatientSearchPage;