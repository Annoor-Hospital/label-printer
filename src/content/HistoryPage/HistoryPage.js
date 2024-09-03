import './_history-page.scss';
import React from 'react';
//import ReactPDF from '@react-pdf/renderer';
import { Page, Text, View, Document, StyleSheet, } from '@react-pdf/renderer';
import {PDFViewer,  } from '@react-pdf/renderer';
import PrintButton from '../../components/PrintButton';

const styles = StyleSheet.create({
    page: {
        //flexDirection:'column',
        backgroundColor: "#FFFFFF",
        alignItems:'center',
        paddingTop: 13,
        
    },
    text: {
        textAlign: 'justify',
        overflowWrap: 'break-word',
        fontSize: '14',
        fontWeight: 'bold',

    }
})

const HistoryPage = () => {
    return (
    <>
  <PDFViewer showToolbar={true} id="LabelPDF"> 
        <Document>
        <Page size={[25, 50]} orientation="landscape" dpi={203} style={styles.page}>
            <View>
                <View style={styles.text}>
                    <Text>MAF202429<br/></Text>
                </View>
                <View style={styles.text}>
                    <Text>Simon Kruik<br/></Text>
                </View>
                <View style={styles.text}>
                    <Text>M | 25<br/></Text>
                </View>
            </View>

        </Page>
        </Document>
        </PDFViewer>
        <PrintButton onClick={() => {document.getElementById("LabelPDF").contentWindow.print()}}/>
    </>
    );
}


export default HistoryPage;