"use client";
import React from "react";

export default function TaxInvoice() {
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            display: "flex",
            flex: "1 1 0%",
            background: "rgb(51, 51, 51)",
          }}
        />
        <div id="doc" style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "1 1 0%",
              minWidth: 854,
              maxWidth: 854,
              paddingLeft: 57,
              paddingRight: 57,
              background: "rgb(255, 255, 255)",
            }}
          >
            <div style={{ width: "100%" }}>
              <div style={{ padding: "30px 10px" }}>
                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    marginBottom: -20,
                  }}
                >
                  <p style={{ fontSize: 35, fontFamily: "arial, sans-serif" }}>
                    Tax Invoice
                  </p>
                </div>

                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    marginBottom: -20,
                  }}
                >
                  <p style={{ fontSize: 35, fontFamily: "arial, sans-serif" }}>
                    Slider Brand
                  </p>
                </div>

                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    marginBottom: -20,
                  }}
                >
                  <p
                    style={{
                      fontSize: 35,
                      fontWeight: 600,
                      fontFamily: "arial, sans-serif",
                    }}
                  >
                    #KGKJU
                  </p>
                </div>

                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    marginBottom: -20,
                  }}
                >
                  <p style={{ fontSize: 28, fontFamily: "arial, sans-serif" }}>
                    Delivery
                  </p>
                </div>

                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    marginBottom: -20,
                  }}
                >
                  <p style={{ fontSize: 18, fontFamily: "arial, sans-serif" }}>
                    17/10/2025 09:22
                  </p>
                </div>

                <div
                  style={{ width: "100%", marginTop: 28, marginBottom: -10 }}
                >
                  <hr style={{ borderTop: "3px dashed" }} />
                </div>

                <p style={{ fontSize: 18, fontFamily: "arial, sans-serif" }}>
                  Customer : Ullas Test Customer
                </p>
                <p style={{ fontSize: 18, fontFamily: "arial, sans-serif" }}>
                  Mobile : 0588849658
                </p>
                <p style={{ fontSize: 18, fontFamily: "arial, sans-serif" }}>
                  Address : Dalma Mall
                </p>

                <div
                  style={{ width: "100%", marginTop: 28, marginBottom: -10 }}
                >
                  <hr style={{ borderTop: "3px dashed" }} />
                </div>

                <p style={{ fontSize: 18, fontFamily: "arial, sans-serif" }}>
                  Source : Grubtech Test
                </p>
                <p style={{ fontSize: 18, fontFamily: "arial, sans-serif" }}>
                  Delivery Mode : Third Party
                </p>
                <p style={{ fontSize: 18, fontFamily: "arial, sans-serif" }}>
                  Payment : Paid by Card
                </p>

                <div
                  style={{ width: "100%", marginTop: 28, marginBottom: -10 }}
                >
                  <hr style={{ borderTop: "3px dashed" }} />
                </div>

                <p style={{ fontSize: 18, fontFamily: "arial, sans-serif" }}>
                  TRN : 09876
                </p>
                <p style={{ fontSize: 18, fontFamily: "arial, sans-serif" }}>
                  INV # : 19
                </p>
                <p style={{ fontSize: 18, fontFamily: "arial, sans-serif" }}>
                  Company Name : Slider
                </p>
                <p style={{ fontSize: 18, fontFamily: "arial, sans-serif" }}>
                  Company Address : Al Sad 29, ICAD 1, Musaffah, Abu Dhabi,
                  United Arab Emirates
                </p>

                <div
                  style={{ width: "100%", marginTop: 28, marginBottom: -10 }}
                >
                  <hr style={{ borderTop: "3px dashed" }} />
                </div>

                {/* Product section */}
                <div
                  style={{ width: "100%", display: "flex", marginBottom: 10 }}
                >
                  <div
                    style={{
                      width: "100%",
                      maxWidth: 78,
                      marginRight: 20,
                      paddingRight: 20,
                      borderRight: "1px solid black",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ flex: "1 1 0%" }} />
                    <div style={{ alignItems: "center", flex: "1 1 0%" }}>
                      <div
                        style={{
                          width: "100%",
                          textAlign: "right",
                          marginBottom: -20,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 35,
                            fontFamily: "arial, sans-serif",
                          }}
                        >
                          1X
                        </p>
                      </div>
                    </div>
                    <div style={{ flex: "1 1 0%" }} />
                  </div>

                  <div style={{ flex: "3 1 0%" }}>
                    <div style={{ marginLeft: 0 }}>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          marginBottom: 10,
                        }}
                      >
                        <div style={{ flex: "2 1 0%" }}>
                          <p
                            style={{
                              fontWeight: 600,
                              fontFamily: "arial, sans-serif",
                            }}
                          >
                            Chicken Pizza
                          </p>
                        </div>
                        <div style={{ flex: "1 1 0%", textAlign: "right" }}>
                          <p
                            style={{
                              fontWeight: 600,
                              fontFamily: "arial, sans-serif",
                            }}
                          >
                            AED 30.00
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr style={{ borderTop: "3px dashed" }} />

                {/* Totals */}
                {[
                  {
                    label: "Subtotal",
                    arabic: "المجموع الفرعي",
                    value: "AED 30.00",
                  },
                  { label: "Discount", arabic: "خصم", value: "AED 0.00" },
                  {
                    label: "Delivery Charge",
                    arabic: "رسوم التوصيل",
                    value: "AED 0.00",
                  },
                  { label: "Total", arabic: "المجموع", value: "AED 30.00" },
                  {
                    label: "Taxable Amount",
                    arabic: "المبلغ الخاضع للضريبة",
                    value: "AED 28.57",
                  },
                  { label: "TAX (5%)", arabic: "", value: "AED 1.43" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{ width: "100%", display: "flex", marginBottom: 10 }}
                  >
                    <div style={{ flex: "2 1 0%" }}>
                      <p
                        style={{
                          fontSize: 18,
                          fontWeight: 600,
                          fontFamily: "arial, sans-serif",
                        }}
                      >
                        {item.label}
                      </p>
                      {item.arabic && (
                        <p
                          style={{
                            fontSize: 19,
                            fontWeight: 600,
                            fontFamily: "Amiri",
                          }}
                        >
                          {item.arabic}
                        </p>
                      )}
                    </div>
                    <div style={{ flex: "1 1 0%", textAlign: "right" }}>
                      <p
                        style={{
                          fontSize: 18,
                          fontWeight: 600,
                          fontFamily: "arial, sans-serif",
                        }}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}

                <hr style={{ borderTop: "3px dashed" }} />

                <p style={{ fontSize: 18, fontFamily: "arial, sans-serif" }}>
                  Order instructions: qwerty
                </p>

                <hr style={{ borderTop: "3px dashed" }} />

                <p style={{ fontSize: 18, fontFamily: "arial, sans-serif" }}>
                  Delivery Note : Test delivery notes
                </p>

                <hr style={{ borderTop: "3px dashed" }} />

                {/* Signature image */}
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <img
                    alt="signature"
                    src="data:image/gif;base64,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"
                    style={{ display: "block", margin: "0 auto" }}
                  />
                </div>

                <hr style={{ borderTop: "3px dashed" }} />
                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    marginBottom: -20,
                  }}
                >
                  <p style={{ fontSize: 18, fontFamily: "arial, sans-serif" }}>
                    Solution by grubtech.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flex: "1 1 0%",
            background: "rgb(51, 51, 51)",
          }}
        />
      </div>
    </div>
  );
}
