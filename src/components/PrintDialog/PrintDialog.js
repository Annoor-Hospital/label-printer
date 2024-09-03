import './_print-dialog.scss';
import React, { useEffect } from 'react';
import {useState} from 'react';
import { FlexGrid, Row, Column, Popover, PopoverContent, NumberInput } from '@carbon/react';
import PrintButton from '../PrintButton';
import SetupPrinter from './PrintLogic';
import JsBarcode from 'jsbarcode';

import { PDFViewer, Page, Image, Text, View, Document, StyleSheet } from '@react-pdf/renderer';


const styles = StyleSheet.create({
    section: {
        margin: 2,
        padding: 5,
        flexGrow: 1
    },
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
    image: {
        height: 24,
        width: 100,
   //     transform: "rotate(270deg)"
    },
    datetime: {
        textAlign: 'right',
        overflowWrap: 'break-word',
        fontSize: '8',
    },
});


{/*
const generatePDF = async (lines) => {
    const doc = new pdf.Document({
        font: Helvetica,
        width: 45 * pdf.mm,
        height: 23 * pdf.mm,
        lineHeight: 1,
        paddingLeft: 0,
        paddingRight: 0,
    });
    lines.forEach((line) => {
        doc.text(line, {fontSize: 12.5, font: Helvetica, textAlign: "center"});
    });
    
    const docBuf = await doc.asBuffer();
    const blob = new Blob([docBuf], {type: 'application/pdf'});
    return blob
}
*/}

const PrintDialog = (props) => {

    let canvas;
    const [open, setOpen] = useState(false);
    canvas = document.createElement('canvas');
    JsBarcode(canvas, props.line1, {"textPosition":"top","height":25,});
    const barcode = canvas.toDataURL();

    return (
        <>
        <Popover autoAlign caret={false} open={open} onRequestClose={() => setOpen(false)}>
            <PrintButton onClick={() => {
                setOpen(!open); 
            }}/>
            <PopoverContent>
                <FlexGrid fullWidth condensed>
                <Row>
                <>
                <PDFViewer showToolbar={false} id={"LabelPDF" + props.line1}>
                        {/*}      <Document>
                        <Page size={[64, 128]} orientation="landscape" dpi={203} style={styles.page}>
                            <View>
                                <View style={styles.text}>
                                    <Text>Line 1<br/></Text>
                                </View>
                                <View style={styles.text}>
                                    <Text>Line 2<br/></Text>
                                </View>
                                <View style={styles.text}>
                                    <Text>Line 3<br/></Text>
                                </View>
                            </View>

                        </Page>
                        </Document>
                        </PDFViewer>
                        <PDFViewer showToolbar={true} id="LabelPDF"> */}
                    <Document>
                        <Page size={[25, 50]} orientation="landscape" dpi={203} style={styles.page}>
                        <View>
                            <View style={styles.text}>
                                <Text style={{textOverflow:"ellipsis", maxLines:1}}>{props.line2}<br/></Text>
                            </View>
                            <View style={styles.text}>
                                <Text>{props.line3}<br/></Text>
                            </View>
                            <View style={styles.text}>
                                <Image src={barcode} style={styles.image}/>
                            </View>
                            <View style={styles.datetime}>
                                <Text style={{ display:"flex", alignSelf:"flex-end" }}>{props.line4}</Text>
                            </View>
                        </View>

                        </Page>
                    </Document>
                </PDFViewer>
                    </>
                </Row>

                {/*<Row>
                    <Column lg={{span: 10, offset: 1}}>
                    <div className="print-lines">
                    <p>
                        {props.line1}
                    </p>
                    </div>
                    </Column>
                </Row>
                <Row>
                    <Column lg={{span: 10, offset: 1}}>
                    <div className="print-lines">
                    <p>
                        {props.line2}
                    </p>
                    </div>
                    </Column>
                </Row><Row>
                    <Column lg={{span: 10, offset: 1}}>
                    <div className="print-lines">  
                    <p>
                        {props.line3}
                    </p>
                    </div>
                    </Column>
        </Row>*/}
                <Row>
   {/*                 
                    <Column sm={2} md={4} lg={8}>
                        <NumberInput id="print-copies" min={1} max={100} value={1} label="Amount of Copies" invalidText="Please enter a number between 1 and 100"/>
                    </Column>
   */}
                    <Column sm={1} md={1} lg={4}>
                        <PrintButton onClick={() => {document.getElementById("LabelPDF" + props.line1).contentWindow.print()}}/>
                    </Column>       
                </Row>
            </FlexGrid>
            </PopoverContent>
        </Popover>
        </>
    );
}

export default PrintDialog;