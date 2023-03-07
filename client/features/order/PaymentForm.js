import React, { useState, useEffect } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { Container, Form, Spinner, Button } from "react-bootstrap";

const PaymentForm = ({placeOrder}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [loading, setLoading] = useState("");
  const [message, setMessage] = useState(null);
  

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
      );
  
    if (!clientSecret) return;

    try {
      const {
        paymentIntent: { status },
      } = stripe.retrievePaymentIntent(clientSecret);

      switch (status) {
        case "processing":
          setMessage("Your payment is processing");
          break;
        case "succeeded":
          setMessage("Payment successful!");
          break;
        case "requires_payment_method":
          setMessage("Payment unsuccessful. Please try again.");
          break;
        default:
          setMessage("Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error processing payment. Please try again.");
    }
  }, [stripe]);

  
  

  async function onSubmit(e) {
    e.preventDefault();

    if (!elements || !stripe) return;

    setLoading(true);

    const {paymentIntent} = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:8080/checkout"
      },
      redirect: 'if_required'
    });
    const {status, error} = paymentIntent;

    if(status && status === "succeeded") {
      placeOrder();
    } else if (error.type === "validation_error" || error.type === "card_error") {
      setMessage(error.message);
    } else {
      setMessage("An error occurred. Please try again.");
    }

    setLoading(false);
  }

  const paymentElementOptions = {
    layout: {
      type: 'accordion',
      defaultCollapsed: false,
      radios: true,
      spacedAccordionItems: false
    }
  };

  return (

          <Form>
            
            <PaymentElement
              id="payment-element"
              options={paymentElementOptions}
            />
            <Button onClick={onSubmit} disabled={loading || !stripe || !elements} id="submit">
              <span id="button-text">
                {loading ? (
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : (
                  "Pay now"
                )}
              </span>
            </Button>
            {message && <div id="payment-message">{message}</div>}
          </Form>
  );
};

export default PaymentForm;
