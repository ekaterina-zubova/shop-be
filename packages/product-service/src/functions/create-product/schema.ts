export default {
  type: "string",
  properties: {
    id: { type: "string" },
    count: { type: "string" },
    description: { type: "string" },
    price: { type: "string" },
    title: { type: "string" },
    logo: { type: "string" },
    author: { type: "string" },
  },
  required: ["description", "price", "title"],
} as const;
