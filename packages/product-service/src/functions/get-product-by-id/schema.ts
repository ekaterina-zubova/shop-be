export default {
  type: "object",
  properties: {
    id: { type: "string" },
    count: { type: "string" },
    description: { type: "string" },
    price: { type: "string" },
    title: { type: "string" },
    logo: { type: "string" },
    author: { type: "string" },
  },
  required: ["id", "description", "price", "title"],
} as const;
