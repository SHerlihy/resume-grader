import {getDocument, GlobalWorkerOptions} from "pdfjs-dist"

GlobalWorkerOptions.workerSrc = "../node_modules/pdfjs-dist/build/pdf.worker.mjs"

export const pdfToStr = async(value: File) => {
    const pdfBuf = await value.arrayBuffer()
    const pdf = getDocument(pdfBuf)
    
    const loadedPdf = await pdf.promise
    const totPages = loadedPdf.numPages
    
    let pdfText = ""
    for (let i=1; i<=totPages; i++) {
        const pageX = await loadedPdf.getPage(i)
        const xText = await pageX.getTextContent()
    
        for (let j=0; j<xText.items.length; j++) {
            const txtItem = xText.items[j]
            if (txtItem.hasOwnProperty("str") === false){
                continue
            }
    
            //@ts-ignore
            pdfText = `${pdfText}${txtItem.str}\n`
        }
    }

    return pdfText
}
