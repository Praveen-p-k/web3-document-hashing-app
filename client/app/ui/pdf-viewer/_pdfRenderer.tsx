import { FC } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Loader from "../loader/_loader";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfRendererType {
  file: File;
  pageNumber: number;
  previewPage: boolean;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
}

const PdfRenderer: FC<PdfRendererType> = ({
  file,
  pageNumber,
  previewPage,
  onDocumentLoadSuccess,
}) => {
  return (
    <Document
      loading={<Loader />}
      className="max-h-max overflow-y-auto cursor-pointer"
      file={file}
      onLoadSuccess={onDocumentLoadSuccess}
    >
      <Page
        loading={<Loader />}
        className="h-full w-full justify-center"
        height={previewPage ? 200 : 800}
        width={previewPage ? 1200 : 400}
        key={`page_${pageNumber}`}
        pageNumber={pageNumber}
        renderAnnotationLayer={false}
        renderTextLayer={false}
      />
    </Document>
  );
};

export default PdfRenderer;
