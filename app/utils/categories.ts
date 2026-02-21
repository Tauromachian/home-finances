import type { Category } from "@/types/category";

export const categories: Category[] = [
  {
    icon: "material-symbols:home",
    color: "#c94f2a",
    bgColor: "#ffe6f9",
    name: "House",
  },
  {
    icon: "material-symbols:sports-basketball",
    color: "#c94f7a",
    bgColor: "#e6fffa",
    name: "Entertainment",
  },
  {
    icon: "material-symbols:fastfood",
    color: "#e8a430",
    bgColor: "#fffae6",
    name: "Food",
  },
  {
    icon: "material-symbols:travel-luggage-and-bags",
    color: "#2a6b5a",
    bgColor: "#ffe6cc",
    name: "Travel",
  },
  {
    icon: "mdi:heart-plus",
    color: "#5a4db0",
    bgColor: "#ffb3b3",
    name: "Health",
  },
  {
    icon: "material-symbols:view-quilt",
    color: "#7a7068",
    bgColor: "#e6e6e6",
    name: "Others",
  },
];

export function getColorByName(name: string) {
  return categories.find((c) => c.name === name).color;
}
