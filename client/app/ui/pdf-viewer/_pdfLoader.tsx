import React, { useReducer, useRef, useState } from "react";
import { pdfjs } from "react-pdf";
import BackwardIcon from "../icons/_backwardIcon";
import ForwardIcon from "../icons/_forwardIcon";
import PreviewPdfPage from "./_previewPdf";
import Loader from "../loader/_loader";
import PdfRenderer from "./_pdfRenderer";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfViewerType {
  file: File;
}

const PDFViewer: React.FC<PdfViewerType> = ({ file }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [previewPage, setPreviewPage] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const tableRef = useRef(null);

  const onScroll = () => {
    //@ts-ignore
    console.log(tableRef.current?.scrollLeft);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setLoading(true);
    setNumPages(numPages);
    setLoading(false);
  };

  const goToPreviousPage = () => {
    console.log("prev");
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  const goToNextPage = () => {
    if (pageNumber < (numPages || 0)) setPageNumber(pageNumber + 1);
  };

  return (
    <div className="text-center h-full mt-10 w-full space-x-10">
      {loading ? (
        <Loader />
      ) : (
        <div
          style={{
            overflow: "scroll",
          }}
          ref={tableRef}
          onScroll={() => onScroll()}
          className="flex justify-evenly w-full space-x-3 relative"
        >
          <button onClick={goToPreviousPage} disabled={pageNumber <= 1}>
            <BackwardIcon fill="white" />
          </button>
          <div onClick={() => setPreviewPage(true)}>
            <PdfRenderer
              file={file}
              pageNumber={pageNumber}
              previewPage={false}
              onDocumentLoadSuccess={onDocumentLoadSuccess}
            />
          </div>
          <button
            className="text-2xl"
            onClick={goToNextPage}
            disabled={pageNumber >= (numPages || 1)}
          >
            <ForwardIcon fill="white" />
          </button>
        </div>
      )}
      <span className="text-center text-xl font-thin text-white-55">
        Page {pageNumber} of {numPages}
      </span>
      {previewPage && (
        <div className="h-1/2 w-1/2" onClick={() => setPreviewPage(false)}>
          <PreviewPdfPage>
            <PdfRenderer
              file={file}
              pageNumber={pageNumber}
              previewPage={true}
              onDocumentLoadSuccess={onDocumentLoadSuccess}
            />
          </PreviewPdfPage>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
