import { ReactNode } from "react";

/**
 * It takes a component and adds a modal for that and returning to parent component
 * @param child component
 * @returns Higher Order Component
 */
const PreviewPdfPage = ({ children }: { children: ReactNode }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 cursor-default h-full w-full">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="preview-page-modal">
        <div className="flex flex-col overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default PreviewPdfPage;
