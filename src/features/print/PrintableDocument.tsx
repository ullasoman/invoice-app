import { formatCurrency, formatNumber } from "@/utils/numberUtils";
import React from "react";

interface PrintableDocumentProps {
  type: "sales" | "purchase" | "quotation";
  document: any;
}

export default function PrintableDocument({
  type,
  document,
}: PrintableDocumentProps) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getTitle = () => {
    switch (type) {
      case "sales":
        return "SALES INVOICE";
      case "purchase":
        return "PURCHASE INVOICE";
      case "quotation":
        return "QUOTATION";
      default:
        return "DOCUMENT";
    }
  };

  const getDocumentNumberText = () => {
    switch (type) {
      case "sales":
        return "Invoice Number";
      case "purchase":
        return "Purchase Order #";
      case "quotation":
        return "Voucher #";
      default:
        return "Document #";
    }
  };

  const isQuotation = type === "quotation";

  return (
    <div
      className="print-content"
      style={{ maxWidth: "210mm", margin: "0 auto" }}
    >
      {/* Header */}
      <header
        className="print-header"
        style={{
          marginBottom: "30px",
          borderBottom: "2px solid #333",
          paddingBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                margin: "0 0 10px 0",
              }}
            >
              {getTitle()}
            </h1>
            <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
              {document.client?.business_name}
            </p>
            <p style={{ fontSize: "12px", color: "#666", margin: "5px 0" }}>
              Phone: {document.client?.tele_phone_number} |{" "}
              {document.client?.mobile_number}
              <br />
              Email: {document.client?.email}
            </p>
            {document.client?.trn_number && !isQuotation && (
              <p style={{ fontSize: "12px", color: "#666", margin: "5px 0" }}>
                TRN No: {document.client.trn_number}
              </p>
            )}
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              {getDocumentNumberText()}:{" "}
              {document.invoice_number || document.estimate_number}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {document.issue_date && (
                <div>Issue Date: {formatDate(document.issue_date)}</div>
              )}
              {document.due_date && (
                <div>Due Date: {formatDate(document.due_date)}</div>
              )}
              {document.status && (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "8px",
                    backgroundColor: "#f3f4f6",
                    borderRadius: "4px",
                  }}
                >
                  Status:{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color:
                        document.status === "paid"
                          ? "#10b981"
                          : document.status === "unpaid"
                          ? "#ef4444"
                          : "#f59e0b",
                    }}
                  >
                    {document.status.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Bill To Section */}
      <section style={{ marginBottom: "30px" }}>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            marginBottom: "10px",
            borderBottom: "1px solid #ddd",
            paddingBottom: "5px",
          }}
        >
          {type === "purchase" ? "Supplier:" : "Bill To:"}
        </h3>

        <div style={{ fontSize: "12px" }}>
          <p style={{ fontWeight: "bold", margin: "5px 0" }}>
            {document.buyer?.name ||
              document.supplier?.name ||
              document.buyer_name}
          </p>
          {(document.buyer?.email || document.supplier?.email) && (
            <p style={{ margin: "3px 0" }}>
              Email: {document.buyer?.email || document.supplier?.email}
            </p>
          )}
          {(document.buyer?.phone_number ||
            document.supplier?.phone_number) && (
            <p style={{ margin: "3px 0" }}>
              Phone:{" "}
              {document.buyer?.phone_number || document.supplier?.phone_number}
            </p>
          )}
          {(document.buyer?.street_address ||
            document.supplier?.street_address ||
            document.buyer_address) && (
            <p style={{ margin: "3px 0" }}>
              Address:{" "}
              {document.buyer?.street_address ||
                document.supplier?.street_address ||
                document.buyer_address}
            </p>
          )}
          {!isQuotation &&
            (document.buyer?.trn_number || document.supplier?.trn_number) && (
              <p style={{ margin: "3px 0" }}>
                TRN No:{" "}
                {document.buyer?.trn_number || document.supplier?.trn_number}
              </p>
            )}
        </div>
      </section>

      {/* Line Items Table */}
      <section style={{ marginBottom: "30px" }}>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            marginBottom: "10px",
            borderBottom: "1px solid #ddd",
            paddingBottom: "5px",
          }}
        >
          Items:
        </h3>
        <table
          style={{
            width: "100%",
            fontSize: "11px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f3f4f6" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>#</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Item
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Qty</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Unit
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Rate
              </th>
              {!isQuotation && (
                <>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Amount
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    VAT %
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    VAT Amount
                  </th>
                </>
              )}
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {document.lines?.map((line: any, i: number) => (
              <tr key={line.id || i}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {i + 1}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <strong>{line.item?.name}</strong>
                  {line.item?.sku && (
                    <div style={{ fontSize: "10px", color: "#666" }}>
                      SKU: {line.item.sku}
                    </div>
                  )}
                </td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    textAlign: "center",
                  }}
                >
                  {line.quantity}
                </td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    textAlign: "center",
                  }}
                >
                  {line.unit}
                </td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(line.unit_price)}
                </td>

                {!isQuotation && (
                  <>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        textAlign: "right",
                      }}
                    >
                      {formatCurrency(line.sub_total)}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        textAlign: "right",
                      }}
                    >
                      {formatNumber(line.tax?.tax_rate)}%
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        textAlign: "right",
                      }}
                    >
                      {formatCurrency(line.tax_amount)}
                    </td>
                  </>
                )}

                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  {formatCurrency(line.total_amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Summary Section */}
      <section style={{ marginTop: "30px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              width: "300px",
              padding: "15px",
              backgroundColor: "#f9fafb",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span>Subtotal:</span>
              <span style={{ fontWeight: "bold" }}>
                {formatCurrency(document.sub_total)}
              </span>
            </div>

            {!isQuotation && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span>VAT Total (5%):</span>
                <span style={{ fontWeight: "bold" }}>
                  {formatCurrency(document.vat_total)}
                </span>
              </div>
            )}

            <div
              style={{
                borderTop: "2px solid #333",
                marginTop: "10px",
                paddingTop: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "16px",
                }}
              >
                <strong>Total:</strong>
                <strong>{formatCurrency(document.grand_total)}</strong>
              </div>
            </div>
          </div>
        </div>

        {document.notes && (
          <div style={{ marginTop: "20px" }}>
            <h4
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Notes:
            </h4>
            <p style={{ fontSize: "11px", color: "#666", margin: 0 }}>
              {document.notes}
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: "50px",
          paddingTop: "20px",
          borderTop: "1px solid #ddd",
          textAlign: "center",
          fontSize: "10px",
          color: "#666",
        }}
      >
        <p style={{ margin: "5px 0" }}>Thank you for your business!</p>
      </footer>
    </div>
  );
}
