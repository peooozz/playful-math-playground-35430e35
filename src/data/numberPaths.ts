// SVG paths for numbers 0-10 designed for tracing
// Each path is designed to be traced in the correct stroke order

export interface NumberData {
  number: number;
  name: string;
  path: string;
  viewBox: string;
  objects: string[];
  objectName: string;
}

export const numberData: NumberData[] = [
  {
    number: 0,
    name: "Zero",
    path: "M 50 15 C 20 15 10 40 10 60 C 10 80 20 105 50 105 C 80 105 90 80 90 60 C 90 40 80 15 50 15",
    viewBox: "0 0 100 120",
    objects: [],
    objectName: "nothing"
  },
  {
    number: 1,
    name: "One",
    path: "M 35 30 L 50 15 L 50 105",
    viewBox: "0 0 100 120",
    objects: ["🍎"],
    objectName: "apple"
  },
  {
    number: 2,
    name: "Two",
    path: "M 20 35 C 20 15 50 5 65 25 C 80 45 50 60 20 105 L 80 105",
    viewBox: "0 0 100 120",
    objects: ["🍎", "🍎"],
    objectName: "apples"
  },
  {
    number: 3,
    name: "Three",
    path: "M 25 20 C 55 5 85 20 70 45 C 55 55 55 55 70 70 C 85 95 55 115 25 100",
    viewBox: "0 0 100 120",
    objects: ["⭐", "⭐", "⭐"],
    objectName: "stars"
  },
  {
    number: 4,
    name: "Four",
    path: "M 65 105 L 65 15 L 15 75 L 85 75",
    viewBox: "0 0 100 120",
    objects: ["🌸", "🌸", "🌸", "🌸"],
    objectName: "flowers"
  },
  {
    number: 5,
    name: "Five",
    path: "M 75 15 L 30 15 L 25 55 C 50 45 80 50 80 75 C 80 105 50 115 25 95",
    viewBox: "0 0 100 120",
    objects: ["🎈", "🎈", "🎈", "🎈", "🎈"],
    objectName: "balloons"
  },
  {
    number: 6,
    name: "Six",
    path: "M 70 20 C 40 10 15 40 15 70 C 15 100 35 110 55 110 C 75 110 85 95 85 75 C 85 55 70 50 50 55 C 30 60 15 70 15 70",
    viewBox: "0 0 100 120",
    objects: ["🐱", "🐱", "🐱", "🐱", "🐱", "🐱"],
    objectName: "cats"
  },
  {
    number: 7,
    name: "Seven",
    path: "M 20 15 L 80 15 L 45 105",
    viewBox: "0 0 100 120",
    objects: ["🍇", "🍇", "🍇", "🍇", "🍇", "🍇", "🍇"],
    objectName: "grapes"
  },
  {
    number: 8,
    name: "Eight",
    path: "M 50 60 C 25 60 20 40 30 25 C 40 10 60 10 70 25 C 80 40 75 60 50 60 C 20 60 10 85 25 100 C 40 115 60 115 75 100 C 90 85 80 60 50 60",
    viewBox: "0 0 100 120",
    objects: ["🦋", "🦋", "🦋", "🦋", "🦋", "🦋", "🦋", "🦋"],
    objectName: "butterflies"
  },
  {
    number: 9,
    name: "Nine",
    path: "M 30 100 C 60 110 85 80 85 50 C 85 20 65 10 45 10 C 25 10 15 25 15 45 C 15 65 30 70 50 65 C 70 60 85 50 85 50",
    viewBox: "0 0 100 120",
    objects: ["🌻", "🌻", "🌻", "🌻", "🌻", "🌻", "🌻", "🌻", "🌻"],
    objectName: "sunflowers"
  },
  {
    number: 10,
    name: "Ten",
    path: "M 15 30 L 25 15 L 25 105 M 60 15 C 45 15 40 35 40 60 C 40 85 45 105 60 105 C 75 105 80 85 80 60 C 80 35 75 15 60 15",
    viewBox: "0 0 100 120",
    objects: ["🎁", "🎁", "🎁", "🎁", "🎁", "🎁", "🎁", "🎁", "🎁", "🎁"],
    objectName: "gifts"
  },
];

export const getNumberData = (num: number): NumberData => {
  return numberData.find(n => n.number === num) || numberData[0];
};
