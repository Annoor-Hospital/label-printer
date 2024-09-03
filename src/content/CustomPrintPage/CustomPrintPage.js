import './_custom-print-page.scss';
import React, { useEffect, useRef } from 'react';
//import ReactPDF from '@react-pdf/renderer';
import { Page, Text, View, Document, StyleSheet, Image, usePDF, } from '@react-pdf/renderer';
import {PDFViewer,  } from '@react-pdf/renderer';
import {ContainedList, ContainedListItem, FluidForm, TextInput, Button} from '@carbon/react';
import { Renew } from '@carbon/icons-react';
import { Catalog } from '@carbon/icons-react';
import PrintButton from '../../components/PrintButton';
import JsBarcode from 'jsbarcode';


const styles = StyleSheet.create({
    page: {
        //flexDirection:'column',
        backgroundColor: "#FFFFFF",
        alignItems:'center',
        paddingTop: 13,
        
    },
    text: {
        textAlign: 'justify',
        fontSize: '11',
        fontWeight: 'bold',
        textOverflow: "ellipsis",
    },
    datetime: {
        textAlign: 'right',
        overflowWrap: 'break-word',
        fontSize: '8',
    },
    image: {
        height: 24,
        width: 100,
   //     transform: "rotate(270deg)"
    }
});
let canvas;
let pdf_key = 1
let barcode_number = "MAF200000";
let line1 = "Patient Name";
let line2 = "M | 54";
let barcode = "data:image/png;base64,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";
let loaded = false;

const SetTemplate = (templateName) => {
    //console.log("Template should be changed to" + templateName);
    // NOT YET IMPLEMENTED
    const template = templateName;
};

const UpdateBarcode = (newBarcode) => {
    JsBarcode(canvas, {barcode_number}, {"textPosition":"top","height":25,});
    barcode = canvas.toDataURL();

};



const PDFStructure = () => {
    return(
<Document>
        <Page key={pdf_key} size={[25, 50]} orientation="landscape" dpi={203} style={styles.page}>
            <View>

                <View style={styles.text}>
                        <Text style={{textOverflow:"ellipsis", maxLines:1}}>{line1}<br/></Text>

                </View>
                <View style={styles.text}>
                    <Text>{line2}<br/></Text>
                </View>
                <View>
                    <Image src={barcode} style={styles.image}/>
                </View>
                <View style={styles.datetime}>
                    <Text style={{ display:"flex", alignSelf:"flex-end" }}>{new Date().toLocaleString()}</Text>
                </View>
            </View>

        </Page>
</Document>
)};



const PrintLines = () => {
    console.log(line1, line2, barcode_number);
    //pdf_key += 1;
    console.log(PDFStructure());
    loaded = false;
}

const UpdateText = (event) => {
    if (event.target.id === "line1") {
        line1 = event.target.value;
    }
    if (event.target.id === "line2") {
//          line2 = new Date().toLocaleTimeString();
        line2 = event.target.value;
    }
    if (event.target.id === "barcode") {
        barcode_number = event.target.value;
        UpdateBarcode(barcode_number);
    }
    pdf_key += 1;
};

const CustomPrintPage = () => {

    canvas = document.createElement('canvas');
    JsBarcode(canvas, barcode_number, {"textPosition":"top","height":30,});
    barcode = canvas.toDataURL();
    //console.log("Barcode data:" + barcode)


    const InternalUpdate = () => {
        updateInstance();
        PrintLines();
        console.log(pdf_key);
    }


        
    const [instance, updateInstance] = usePDF({
        document: <PDFStructure/>
    });

    const handleSearchKey = (keyEvent) => {
        if (keyEvent.keyCode === 13) {
            updateInstance();
        }
    }

    useEffect(() => {
        //PrintLines()
        updateInstance(<PDFStructure/>)
    },[updateInstance,<PDFStructure/>])
    return (
    <>
 {/*   <ContainedList label="Print template" kind="on-page">
        <ContainedListItem renderItem={Catalog} onClick={SetTemplate('2_lines_barcode')}>2 Lines + Barcode</ContainedListItem>
        <ContainedListItem renderItem={Catalog} onClick={SetTemplate('3_lines')} disabled>3 Lines</ContainedListItem>
        <ContainedListItem renderItem={Catalog} onClick={SetTemplate('2_lines')} disabled>2 Lines</ContainedListItem>
    </ContainedList> */}
    <FluidForm>
    <TextInput id="line1" type="text" onKeyDown={handleSearchKey} onChange={UpdateText} labelText="First line" placeholder="Patient Name" defaultValue={line1 === "Patient Name" ? "" : line1}/>
    <TextInput id="line2" type="text" onKeyDown={handleSearchKey} onChange={UpdateText} labelText="Second line" placeholder="M | 54" defaultValue={line2 === "M | 54" ? "" : line2} />
    <TextInput id="barcode" type="text" onKeyDown={handleSearchKey} onChange={UpdateText} labelText="Barcode" placeholder="MAF200000" defaultValue={barcode_number === "MAF200000" ? "" : barcode_number}/>
    </FluidForm>
    <PDFViewer showToolbar={false} id="LabelPDF">
        <PDFStructure/>
    </PDFViewer>
    <PrintButton onClick={() => {document.getElementById("LabelPDF").contentWindow.print()}}/>
    <Button renderIcon={Renew} iconDescription="refresh" onClick={InternalUpdate}>Renew</Button>
    
    </>
    
    );
}


export default CustomPrintPage;