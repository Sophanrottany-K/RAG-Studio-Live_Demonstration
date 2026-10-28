// The demo Billing Assistant's knowledge base. The text matches the Figma previews of the
// original files (#/pvPdf, #/pvDocx, #/pvXlsx), so answers quote what the viewer shows.
// Nothing here covers student discounts: that is the question the demo answers only after
// a "Student discount policy" document is added.

export type DemoDocument = {
  id: string;
  name: string;
  type: string;
  sizeBytes: number;
  uploadedAt: string;
  preview: "pdf" | "docx" | "xlsx" | "md";
  text: string;
};

export const DEMO_DOCUMENTS: DemoDocument[] = [
  {
    id: "doc_demo_refund",
    name: "Refund policy 2026.pdf",
    type: "PDF",
    sizeBytes: 1_240_000,
    uploadedAt: "2026-10-02T09:00:00.000Z",
    preview: "pdf",
    text: `Refund Policy 2026. Effective January 1, 2026.

1. Eligibility. Items purchased from Acme may be returned within 30 days of delivery for a full refund, provided they are unused and in their original packaging.

2. How to request a refund. Start a return from Orders in your account, or contact support with your order number. We email a prepaid shipping label within one business day.

3. Refund timing. Refunds are issued to the original payment method within 5–7 business days after we receive the item. Shipping fees are non-refundable unless the item arrived damaged.

4. Exceptions. Gift cards, final-sale items and personalised products cannot be returned.`,
  },
  {
    id: "doc_demo_billing_faq",
    name: "Billing FAQ.docx",
    type: "DOCX",
    sizeBytes: 340_000,
    uploadedAt: "2026-10-02T09:00:00.000Z",
    preview: "docx",
    text: `Billing FAQ. Version 2.1 · Last updated September 28, 2026.

1. Invoices and receipts. Invoices are created on the 1st of every month and sent to the billing email on your account. You can download past invoices from Settings → Billing.

2. Changing your payment method. Open Settings → Billing and select Payment method. Choose Add card or Add bank account. Set the new method as default before the next invoice date. Remove the old method if you no longer need it.

3. Who to contact. Billing questions: billing@acme.com, within 1 business day. Refund requests: refunds@acme.com, 2 business days. Failed payments: payments@acme.com, within 4 hours.

4. Plans and upgrades. Plan changes take effect right away. Upgrades are charged pro-rata for the rest of the billing month; downgrades apply from the next invoice. Starter — 1 workspace, monthly billing. Business — up to 10 workspaces, monthly or yearly. Enterprise — custom limits and invoicing.`,
  },
  {
    id: "doc_demo_pricing",
    name: "Pricing plans Q4.xlsx",
    type: "XLSX",
    sizeBytes: 356_000,
    uploadedAt: "2026-10-11T09:00:00.000Z",
    preview: "xlsx",
    text: `Pricing plans (monthly and annual price in USD, seats, messages per month).

Starter: self-serve, 29.00 per month or 295.80 per year, 3 seats, 2,000 messages. Starter+: self-serve, 49.00 per month or 499.80 per year, 5 seats, 5,000 messages. Team: self-serve, 99.00 per month or 1,009.80 per year, 10 seats, 15,000 messages. Team+: self-serve, 149.00 per month or 1,519.80 per year, 20 seats, 30,000 messages.

Business: sales-led, 299.00 per month or 3,049.80 per year, 50 seats, 100,000 messages. Business+: sales-led, 499.00 per month or 5,089.80 per year, 100 seats, 250,000 messages. Enterprise: sales-led, custom price, unlimited seats and messages.

Add-ons: extra seats 8.00 per month, 10,000 extra messages 20.00 per month, SSO 50.00 per month.`,
  },
  {
    id: "doc_demo_payment_methods",
    name: "Payment methods.md",
    type: "MD",
    sizeBytes: 14_000,
    uploadedAt: "2026-10-02T09:00:00.000Z",
    preview: "md",
    text: `# Payment methods

We accept Visa, Mastercard and American Express credit or debit cards, and bank transfer (ACH or SEPA) for yearly plans.

Card payments are charged automatically on the invoice date. Bank transfers must arrive within 14 days of the invoice date.

If a card payment fails, we retry it after 3 days and email the billing contact. After 3 failed attempts the workspace switches to read-only until the invoice is paid.

We don't accept cash, cheques, PayPal or cryptocurrency.`,
  },
];
