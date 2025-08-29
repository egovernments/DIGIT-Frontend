import React from "react";
import QRCode from "react-qr-code";

const UserQRPopup = ({ userName, userId, isOpen, onClose }) => {
  if (!isOpen) return null;

  const qrValue = `${userName}||${userId}`;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }} onClick={onClose}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px",
        backgroundColor: "white",
        borderRadius: "8px",
        maxWidth: "400px",
        margin: "0 auto",
        position: "relative"
      }} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "4px",
            color: "#666"
          }}
        >
          ×
        </button>
        
        <h3 style={{
          margin: "0 0 16px 0",
          fontSize: "18px",
          fontWeight: "600",
          color: "#333",
          textAlign: "center"
        }}>
          User QR Code
        </h3>
        
        <div style={{
          padding: "16px",
          backgroundColor: "white",
          borderRadius: "8px",
          border: "2px solid #f0f0f0",
          marginBottom: "16px"
        }}>
          <QRCode 
            value={qrValue} 
            size={200}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          />
        </div>
        
        <div style={{
          textAlign: "center",
          fontSize: "14px",
          color: "#666",
          lineHeight: "1.5"
        }}>
          <div style={{ marginBottom: "8px" }}>
            <strong>User:</strong> {userName}
          </div>
          <div style={{ marginBottom: "8px" }}>
            <strong>ID:</strong> {userId}
          </div>
          <div style={{ 
            fontSize: "12px", 
            color: "#999",
            fontStyle: "italic",
            marginTop: "12px",
            padding: "8px",
            backgroundColor: "#f8f9fa",
            borderRadius: "4px"
          }}>
            QR Code Content: {qrValue}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserQRPopup;