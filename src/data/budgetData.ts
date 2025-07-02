import { BudgetItem } from '../types';

export const defaultBudgetCategories: Omit<BudgetItem, 'id'>[] = [
  { category: 'Venue', budgeted: 0, spent: 0 },
  { category: 'Catering', budgeted: 0, spent: 0 },
  { category: 'Photography', budgeted: 0, spent: 0 },
  { category: 'Flowers', budgeted: 0, spent: 0 },
  { category: 'Music/DJ', budgeted: 0, spent: 0 },
  { category: 'Dress & Attire', budgeted: 0, spent: 0 },
  { category: 'Transportation', budgeted: 0, spent: 0 },
  { category: 'Decorations', budgeted: 0, spent: 0 },
  { category: 'Stationery', budgeted: 0, spent: 0 },
  { category: 'Miscellaneous', budgeted: 0, spent: 0 }
];