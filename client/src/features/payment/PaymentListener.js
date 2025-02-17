import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { updatePaymentStatus } from "./paymentSlice";

const socket = io(import.meta.env.VITE_API_URL, {
    withCredentials: true,
});

const PaymentListener = ({ invoiceId }) => {
    const dispatch = useDispatch();
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        if (!invoiceId || isListening) return; // Prevent re-triggering

        setIsListening(true);
        console.log("Listening for payment updates on invoice:", invoiceId);

        socket.on("paymentUpdate", (data) => {
            if (data.invoiceId === invoiceId) {
                console.log("Received Payment Update:", data);
                dispatch(updatePaymentStatus(data)); // Update Redux store
            }
        });

        return () => {
            socket.off("paymentUpdate");
            console.log("Stopped listening for invoice:", invoiceId);
        };
    }, [invoiceId, dispatch]);

    return null; // No UI needed
};

export default PaymentListener;
