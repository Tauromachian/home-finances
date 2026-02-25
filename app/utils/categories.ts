import type { Category } from "@/types/category";

export const expensesCategories: Category[] = [
  {
    icon: "material-symbols:home",
    color: "#2563eb",
    name: "House",
  },
  {
    icon: "material-symbols:sports-basketball",
    color: "#ec4899",
    name: "Entertainment",
  },
  {
    icon: "material-symbols:fastfood",
    color: "#f59e0b",
    name: "Food",
  },
  {
    icon: "material-symbols:travel-luggage-and-bags",
    color: "#0d9488",
    name: "Travel",
  },
  {
    icon: "mdi:heart-plus",
    color: "#8b5cf6",
    name: "Health",
  },
  {
    icon: "material-symbols:view-quilt",
    color: "#64748b",
    name: "Others",
  },
];

export const assetsCategories: Category[] = [
  {
    icon: "material-symbols:work",
    color: "#2563eb",
    name: "Stocks/ETFs",
  },
  {
    icon: "material-symbols:currency-bitcoin",
    color: "#8B5CF6",
    name: "Crypto",
  },
  {
    icon: "material-symbols:money-bag-rounded",
    color: "#0D9488",
    name: "Savings",
  },
];

export function getCategoryByName(name: string, categories: Category[]) {
  for (const category of categories) {
    if (category.name === name) return category;
  }
}

export function getColorByName(name: string) {
  return expensesCategories.find((c) => c.name === name).color;
}
