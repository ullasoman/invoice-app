/**
 * Utility function to print HTML content in a clean A4 layout
 * Removes browser headers/footers, avoids blank pages
 * Works for any invoice, quotation, or document
 */

export const printHTML = (content: string, title: string = "Document") => {
  if (!content) return;

  const printWindow = window.open("", "_blank", "width=900,height=650");

  if (!printWindow) {
    console.error("Popup blocked — allow popups for this site to print.");
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page {
            size: A4;
            margin: 0; /* remove default header/footer space */
          }

          body {
            margin: 1cm;
            font-family: Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          table {
            border-collapse: collapse;
            width: 100%;
          }

          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }

          th {
            background-color: #f3f4f6;
          }

          h1, h2, h3, h4 {
            margin: 0;
            padding: 0;
          }

          /* Avoid blank pages */
          html, body {
            height: auto !important;
            overflow: visible !important;
          }
        </style>
      </head>
      <body>${content}</body>
    </html>
  `);

  printWindow.document.close();

  printWindow.addEventListener("load", () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  });
};
