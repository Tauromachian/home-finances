import type { Category } from "@/types/category";

export const categories: Category[] = [
  {
    icon: "material-symbols:home",
    color: "#990073",
    bgColor: "#ffe6f9",
    name: "House",
  },
  {
    icon: "ic:round-catching-pokemon",
    color: "#ff3300",
    bgColor: "#ffe6e6",
    name: "Pet",
  },
  {
    icon: "material-symbols:sports-basketball",
    color: "#00cca3",
    bgColor: "#e6fffa",
    name: "Entertainment",
  },
  {
    icon: "material-symbols:fastfood",
    color: "#ffcc00",
    bgColor: "#fffae6",
    name: "Food",
  },
  {
    icon: "material-symbols:travel-luggage-and-bags",
    color: "#663300",
    bgColor: "#ffe6cc",
    name: "Travel",
  },
  {
    icon: "mdi:heart-plus",
    color: "#b30000",
    bgColor: "#ffb3b3",
    name: "Health",
  },
  {
    icon: "mdi:tshirt-crew",
    color: "#00aaff",
    bgColor: "#e6f7ff",
    name: "Clothes",
  },
  {
    icon: "material-symbols:featured-seasonal-and-gifts",
    color: "#00b300",
    bgColor: "#e6ffe6",
    name: "Gift",
  },
  {
    icon: "material-symbols:account-balance",
    color: "#ffcc00",
    bgColor: "#ffcccc",
    name: "Tax",
  },
  {
    icon: "material-symbols:productivity",
    color: "#3385ff",
    bgColor: "#e6f0ff",
    name: "Productivity",
  },
  {
    icon: "material-symbols:view-quilt",
    color: "#4d4d4d",
    bgColor: "#e6e6e6",
    name: "Others",
  },
];

export function getColorByName(name: string) {
  return categories.find((c) => c.name === name).color;
}
