import { ChecklistItem } from '../types';

export const defaultChecklist: ChecklistItem[] = [
  {
    id: '1',
    title: 'Set Your Wedding Date',
    description: 'Choose your perfect day and send save the dates',
    category: 'Planning',
    priority: 'high',
    completed: false,
    dueDate: '12 months before',
    timeframe: '12+ months'
  },
  {
    id: '2',
    title: 'Create Your Budget',
    description: 'Determine how much you want to spend on your wedding',
    category: 'Budget',
    priority: 'high',
    completed: false,
    dueDate: '12 months before',
    timeframe: '12+ months'
  },
  {
    id: '3',
    title: 'Book Your Venue',
    description: 'Secure your ceremony and reception locations',
    category: 'Venue',
    priority: 'high',
    completed: false,
    dueDate: '10-12 months before',
    timeframe: '10-12 months'
  },
  {
    id: '4',
    title: 'Hire Your Photographer',
    description: 'Book a photographer to capture your special day',
    category: 'Vendors',
    priority: 'high',
    completed: false,
    dueDate: '8-10 months before',
    timeframe: '8-10 months'
  },
  {
    id: '5',
    title: 'Choose Your Wedding Dress',
    description: 'Find and order your perfect wedding dress',
    category: 'Attire',
    priority: 'high',
    completed: false,
    dueDate: '6-8 months before',
    timeframe: '6-8 months'
  },
  {
    id: '6',
    title: 'Send Invitations',
    description: 'Mail your wedding invitations to guests',
    category: 'Invitations',
    priority: 'medium',
    completed: false,
    dueDate: '6-8 weeks before',
    timeframe: '6-8 weeks'
  },
  {
    id: '7',
    title: 'Final Menu Tasting',
    description: 'Finalize your wedding menu with the caterer',
    category: 'Catering',
    priority: 'medium',
    completed: false,
    dueDate: '2-4 weeks before',
    timeframe: '2-4 weeks'
  },
  {
    id: '8',
    title: 'Wedding Rehearsal',
    description: 'Practice your ceremony with the wedding party',
    category: 'Ceremony',
    priority: 'high',
    completed: false,
    dueDate: '1-2 days before',
    timeframe: '1-2 days'
  }
];