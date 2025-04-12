import {
  reactExtension,
  Banner,
  BlockStack,
  Checkbox,
  Text,
  useApi,
  useApplyAttributeChange,
  useInstructions,
  useTranslate,
  Link,
  Button,
  View
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();
  const instructions = useInstructions();
  const applyAttributeChange = useApplyAttributeChange();

  if (!instructions.attributes.canUpdateAttributes) {
    return (
      <Banner title="thankyoupage" status="warning">
        <Text> Hello world</Text>
      </Banner>
    );
  }

  const editOrderUrl = "";

  return (
    <BlockStack border="dotted" padding="tight" spacing="loose">
      <Banner title="Thank You Page">
        {translate("welcome", {
          target: <Text emphasis="italic">{extension.target}</Text>,
        })}
      </Banner>
      <Checkbox onChange={onCheckboxChange}>
        {translate("iWouldLikeAFreeGiftWithMyOrder")}
      </Checkbox>

      {/* 🔁 Edit Order Section */}
      <View border="base" padding="base" cornerRadius="base">
        <BlockStack spacing="tight">
          <Text size="medium" emphasis="bold">
            Make changes to your order
          </Text>
          <Text size="small" tone="subdued">
            Edit your shipping details or replace products before finalizing.
          </Text>
          <Link to={editOrderUrl} target="_blank">
            <Button>Go to Edit Order Page</Button>
          </Link>
        </BlockStack>
      </View>
    </BlockStack>
  );

  async function onCheckboxChange(isChecked) {
    const result = await applyAttributeChange({
      key: "requestedFreeGift",
      type: "updateAttribute",
      value: isChecked ? "yes" : "no",
    });
    console.log("applyAttributeChange result", result);
  }
}
