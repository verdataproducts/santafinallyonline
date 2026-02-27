// Local Product Data - Independent from Shopify

export interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  price: number;
  images: string[];
  category: string[];
  ageRange: string[];
  inStock: boolean;
}

// Import product images
import nintendoSwitch from "@/assets/products/nintendo-switch.jpg";
import nintendoSwitchAction1 from "@/assets/products/nintendo-switch-action-1.jpg";
import nintendoSwitchAction2 from "@/assets/products/nintendo-switch-action-2.jpg";
import nintendoSwitchAction3 from "@/assets/products/nintendo-switch-action-3.jpg";
import nintendoSwitchAction4 from "@/assets/products/nintendo-switch-action-4.jpg";
import nintendoSwitchAction5 from "@/assets/products/nintendo-switch-action-5.jpg";

import barbieDreamhouse from "@/assets/products/barbie-dreamhouse.jpg";
import barbieDreamhouseAction1 from "@/assets/products/barbie-dreamhouse-action-1.jpg";
import barbieDreamhouseAction2 from "@/assets/products/barbie-dreamhouse-action-2.jpg";
import barbieDreamhouseAction3 from "@/assets/products/barbie-dreamhouse-action-3.jpg";
import barbieDreamhouseAction4 from "@/assets/products/barbie-dreamhouse-action-4.jpg";
import barbieDreamhouseAction5 from "@/assets/products/barbie-dreamhouse-action-5.jpg";

import hotWheelsGarage from "@/assets/products/hot-wheels-garage.jpg";
import hotWheelsGarageAction1 from "@/assets/products/hot-wheels-garage-action-1.jpg";
import hotWheelsGarageAction2 from "@/assets/products/hot-wheels-garage-action-2.jpg";
import hotWheelsGarageAction3 from "@/assets/products/hot-wheels-garage-action-3.jpg";
import hotWheelsGarageAction4 from "@/assets/products/hot-wheels-garage-action-4.jpg";
import hotWheelsGarageAction5 from "@/assets/products/hot-wheels-garage-action-5.jpg";

import legoPandaFamily from "@/assets/products/lego-panda-family.jpg";
import legoPandaAction1 from "@/assets/products/lego-panda-action-1.jpg";
import legoPandaAction2 from "@/assets/products/lego-panda-action-2.jpg";
import legoPandaAction3 from "@/assets/products/lego-panda-action-3.jpg";
import legoPandaAction4 from "@/assets/products/lego-panda-action-4.jpg";
import legoPandaAction5 from "@/assets/products/lego-panda-action-5.jpg";

export const products: Product[] = [
  {
    id: "1",
    title: "Nintendo Switch 2 Console Bundle",
    description: "The latest Nintendo Switch 2 with enhanced graphics, larger OLED display, and backward compatibility. Includes Joy-Con controllers and dock. The ultimate gaming experience for the whole family.",
    handle: "nintendo-switch",
    price: 500,
    images: [nintendoSwitch, nintendoSwitchAction1, nintendoSwitchAction2, nintendoSwitchAction3, nintendoSwitchAction4, nintendoSwitchAction5],
    category: ["games"],
    ageRange: ["6-8", "9-12", "teens"],
    inStock: true,
  },
  {
    id: "2",
    title: "Barbie DreamHouse 2026 Edition",
    description: "The ultimate Barbie DreamHouse with 3 floors, 10 rooms, a working elevator, pool, and slide! Includes 75+ accessories and furniture pieces. The dream home every Barbie fan needs.",
    handle: "barbie-dreamhouse",
    price: 350,
    images: [barbieDreamhouse, barbieDreamhouseAction1, barbieDreamhouseAction2, barbieDreamhouseAction3, barbieDreamhouseAction4, barbieDreamhouseAction5],
    category: ["dolls"],
    ageRange: ["3-5", "6-8"],
    inStock: true,
  },
  {
    id: "3",
    title: "Hot Wheels Ultimate Garage Playset",
    description: "Massive multi-level garage with motorized elevator, spiral ramp, and space for 100+ cars. Features a roaring dinosaur that attacks cars as they race down. Hours of high-speed fun!",
    handle: "hot-wheels-garage",
    price: 250,
    images: [hotWheelsGarage, hotWheelsGarageAction1, hotWheelsGarageAction2, hotWheelsGarageAction3, hotWheelsGarageAction4, hotWheelsGarageAction5],
    category: ["action"],
    ageRange: ["3-5", "6-8", "9-12"],
    inStock: true,
  },
  {
    id: "4",
    title: "LEGO Panda Family Adventure Set",
    description: "Build an adorable panda sanctuary with bamboo forest, waterfall, and baby pandas! Includes 4 minifigures and detailed wildlife accessories. A creative building experience for LEGO fans.",
    handle: "lego-panda-family",
    price: 199,
    images: [legoPandaFamily, legoPandaAction1, legoPandaAction2, legoPandaAction3, legoPandaAction4, legoPandaAction5],
    category: ["stem"],
    ageRange: ["6-8", "9-12"],
    inStock: true,
  },
];

export const getProducts = (): Product[] => {
  return products;
};

export const getProductByHandle = (handle: string): Product | undefined => {
  return products.find(p => p.handle === handle);
};
