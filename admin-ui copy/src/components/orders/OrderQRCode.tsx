import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface OrderQRCodeProps {
    orderId: string;
    orderData?: any;
}

const OrderQRCode: React.FC<OrderQRCodeProps> = ({ orderId, orderData }) => {
    const qrValue = JSON.stringify({
        orderId,
        ...orderData
    });

    return (
        <div className="qr-code-container">
            <h3>Order QR Code</h3>
            <QRCodeSVG 
                value={qrValue}
                size={200}
                level="M"
                includeMargin={true}
            />
            <p>Order ID: {orderId}</p>
        </div>
    );
};

export default OrderQRCode;