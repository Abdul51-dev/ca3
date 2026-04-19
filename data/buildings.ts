export type BuildingCategory = 'academic' | 'library' | 'social' | 'sports' | 'food';

export interface Building {
  id: string;
  label: string;       // short pin label
  name: string;        // full display name
  description: string;
  pills: string[];     // hours, floors, accessibility
  category: BuildingCategory;
  color: string;       // pin accent colour
  // position on the 480×260 SVG viewBox as percentages
  left: number;        // 0–100
  top: number;         // 0–100
}

export const categoryColor: Record<BuildingCategory, string> = {
  academic: '#1a1a18',
  library:  '#2563eb',
  social:   '#d97706',
  sports:   '#16a34a',
  food:     '#dc2626',
};

export const buildings: Building[] = [
  {
    id: 'A',
    label: 'A',
    name: 'Block A — Aungier St.',
    description: 'Main academic building with lecture halls, seminar rooms, and admin offices. Home to the School of Science and Computing.',
    pills: ['Mon–Fri  8:00–22:00', '5 floors', 'Accessible'],
    category: 'academic',
    color: '#1a1a18',
    left: 18,
    top: 27,
  },
  {
    id: 'B',
    label: 'B',
    name: 'Block B — East Quad',
    description: 'Engineering and science labs. Houses the physics and chemistry departments along with specialist lab equipment.',
    pills: ['Mon–Fri  8:00–21:00', '4 floors', 'Accessible'],
    category: 'academic',
    color: '#1a1a18',
    left: 18,
    top: 65,
  },
  {
    id: 'LIB',
    label: 'LIB',
    name: 'Grangegorman Library',
    description: 'Central library with 24/7 student access. Includes quiet study zones, group rooms, printing, and digital resources.',
    pills: ['24/7 access', '3 floors', 'Accessible'],
    category: 'library',
    color: '#2563eb',
    left: 49,
    top: 22,
  },
  {
    id: 'HUB',
    label: 'HUB',
    name: 'Student Hub',
    description: 'Social and support centre. Home to student services, SU offices, welfare teams, and casual seating areas.',
    pills: ['Mon–Fri  9:00–20:00', '2 floors', 'Accessible'],
    category: 'social',
    color: '#d97706',
    left: 49,
    top: 65,
  },
  {
    id: 'CS',
    label: 'CS',
    name: 'Computing Faculty',
    description: 'Dedicated computing and software building. Contains all CS lecture rooms, labs, servers, and the Digital Futures Hub.',
    pills: ['Mon–Fri  8:00–22:00', '4 floors', 'Accessible'],
    category: 'academic',
    color: '#1a1a18',
    left: 79,
    top: 32,
  },
  {
    id: 'SP',
    label: 'SP',
    name: 'Sports Complex',
    description: 'Full sports facility with gym, basketball courts, changing rooms, and a climbing wall. Student membership available.',
    pills: ['Mon–Sat  7:00–22:00', '2 floors', 'Accessible'],
    category: 'sports',
    color: '#16a34a',
    left: 70,
    top: 68,
  },
  {
    id: 'CAN',
    label: 'CAN',
    name: 'Main Canteen',
    description: 'Multi-cuisine student canteen with hot meals, grab & go, and barista coffee. Vending machines available off-hours.',
    pills: ['Mon–Fri  8:00–19:00', '1 floor', 'Accessible'],
    category: 'food',
    color: '#dc2626',
    left: 88,
    top: 68,
  },
];
