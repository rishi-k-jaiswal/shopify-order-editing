import {
  reactExtension,
  BlockStack,
  View,
  Heading,
  Text,
  ChoiceList,
  Choice,
  Button,
  useStorage,
  useShippingAddress
} from '@shopify/ui-extensions-react/checkout';
import { useCallback, useEffect, useState } from 'react';
// Allow the attribution survey to display on the thank you page.
const thankYouBlock = reactExtension("purchase.thank-you.block.render", () => <Attribution />);
export { thankYouBlock };

const orderDetailsBlock = reactExtension("customer-account.order-status.block.render", () => <ProductReview />);
export { orderDetailsBlock };
function Attribution() {
  const [attribution, setAttribution] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    // Simulate a server request
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        // Send the review to the server
        console.log('Submitted:', attribution);
        setLoading(false);
        setAttributionSubmitted(true)
        resolve();
      }, 750)
    });
  }

  // Hides the survey if the attribution has already been submitted
  if (attributionSubmitted.loading || attributionSubmitted.data === true) {
    return null;
  }

  return (
    <Survey title="How did you hear about us ?" onSubmit={handleSubmit} loading={loading}>
      <ChoiceList
        name="sale-attribution"
        value={attribution}
        onChange={setAttribution}
      >
        <BlockStack>
          <Choice id="tv">TV</Choice>
          <Choice id="podcast">Podcast</Choice>
          <Choice id="family">From a friend or family member</Choice>
          <Choice id="tiktok">Tiktok</Choice>
        </BlockStack>
      </ChoiceList>
    </Survey>
  );
}

function ProductReview() {
  const address = useShippingAddress();
  const [productReview, setProductReview] = useState('');
  const [loading, setLoading] = useState(false);
  // Store into local storage if the product was reviewed by the customer.

  async function handleSubmit() {
    console.log(address);
    // Simulate a server request
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        // Send the review to the server
        console.log('Submitted:', productReview);
        setLoading(false);

        const url = 'http://localhost:3000/api/shipping';
        const data = address;

        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }).then(response => response.json()).then(result => {
          console.log('Success:', result);
        }).catch(error => {
          console.error('Error:', error);
        });

        resolve();
      }, 750)
    });
  }

  return (
    <Survey
      title="Let us know what do you want to change"
      description="we will raise a request to the seller and get back to you"
      onSubmit={handleSubmit}
      loading={loading}
    >
      <ChoiceList
        name="product-review"
        value={productReview}
        onChange={setProductReview}
      >
        <BlockStack>
          <Choice id="5">Change the shipping address.</Choice>
          <Choice id="4">Change product variant</Choice>
          <Choice id="3">Change the quantity of the item</Choice>
          <Choice id="2">Cancel the order</Choice>
        </BlockStack>
      </ChoiceList>
    </Survey>
  );
}

function Survey({
  title,
  description,
  onSubmit,
  children,
  loading,
}) {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    await onSubmit();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <View border="base" padding="base" borderRadius="base">
        <BlockStack>
          <Heading>Thanks!</Heading>
          <Text>We have received your request. We will get back to you soon.</Text>
        </BlockStack>
      </View>
    );
  }

  return (
    <View border="base" padding="base" borderRadius="base">
      <BlockStack>
        <Heading>{title}</Heading>
        <Text>{description}</Text>
        {children}
        <Button kind="secondary" onPress={handleSubmit} loading={loading}>
          Raise Request
        </Button>
      </BlockStack>
    </View>
  );
}
