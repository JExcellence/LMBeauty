/**
 * Mock data for Private Beauty Space development
 * Realistic German content for LM Beauty salon
 */

import type { TreatmentHistory, Appointment, ProductPurchase, CareTip } from '@/types';

// Helper to create dates relative to today
const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const daysFromNow = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

// Mock Treatment History
export const mockTreatments: TreatmentHistory[] = [
  {
    id: 'th-001',
    userId: 'user-001',
    treatmentId: 'treat-001',
    treatmentName: 'Wimpernverlängerung Classic',
    completedAt: daysAgo(14),
    notes: 'Natürlicher Look, sehr zufrieden',
    staffMember: 'Lisa',
  },
  {
    id: 'th-002',
    userId: 'user-001',
    treatmentId: 'treat-002',
    treatmentName: 'Augenbrauen Styling',
    completedAt: daysAgo(28),
    staffMember: 'Lisa',
  },
  {
    id: 'th-003',
    userId: 'user-001',
    treatmentId: 'treat-003',
    treatmentName: 'Wimpernlifting',
    completedAt: daysAgo(45),
    notes: 'Perfekter Schwung',
    staffMember: 'Lisa',
  },
  {
    id: 'th-004',
    userId: 'user-001',
    treatmentId: 'treat-004',
    treatmentName: 'Browlamination',
    completedAt: daysAgo(60),
    staffMember: 'Lisa',
  },
  {
    id: 'th-005',
    userId: 'user-001',
    treatmentId: 'treat-005',
    treatmentName: 'Wimpernverlängerung Volume',
    completedAt: daysAgo(90),
    notes: 'Glamour Look für Hochzeit',
    staffMember: 'Lisa',
  },
  {
    id: 'th-006',
    userId: 'user-001',
    treatmentId: 'treat-001',
    treatmentName: 'Wimpernverlängerung Classic',
    completedAt: daysAgo(120),
    staffMember: 'Lisa',
  },
];

// Mock Upcoming Appointment
export const mockAppointment: Appointment = {
  id: 'apt-001',
  userId: 'user-001',
  treatmentId: 'treat-001',
  treatmentName: 'Wimpernverlängerung Refill',
  scheduledDate: daysFromNow(5),
  scheduledTime: '14:30',
  status: 'scheduled',
};

// Mock Product Purchases
export const mockProducts: ProductPurchase[] = [
  {
    id: 'prod-001',
    userId: 'user-001',
    productId: 'p-001',
    productName: 'Wimpernserum Deluxe',
    productImageUrl: '/images/products/serum.jpg',
    purchasedAt: daysAgo(14),
  },
  {
    id: 'prod-002',
    userId: 'user-001',
    productId: 'p-002',
    productName: 'Augenbrauen Gel',
    productImageUrl: '/images/products/brow-gel.jpg',
    purchasedAt: daysAgo(28),
  },
  {
    id: 'prod-003',
    userId: 'user-001',
    productId: 'p-003',
    productName: 'Pflegeöl für Wimpern',
    productImageUrl: '/images/products/oil.jpg',
    purchasedAt: daysAgo(45),
  },
];

// Mock Care Tips
export const mockCareTips: CareTip[] = [
  {
    id: 'tip-001',
    title: 'Wimpernpflege nach der Verlängerung',
    content: 'Vermeide in den ersten 24 Stunden Wasser und Dampf. Bürste deine Wimpern täglich sanft mit dem Bürstchen.',
    icon: 'sparkles',
    relevantTreatments: ['treat-001', 'treat-005'],
  },
  {
    id: 'tip-002',
    title: 'Augenbrauen nach dem Styling',
    content: 'Trage für 24 Stunden kein Make-up auf die Brauen auf. Vermeide Schwimmen und Sauna für 48 Stunden.',
    icon: 'heart',
    relevantTreatments: ['treat-002', 'treat-004'],
  },
  {
    id: 'tip-003',
    title: 'Allgemeine Beauty-Tipps',
    content: 'Trinke ausreichend Wasser und schlafe genug – das ist die beste Grundlage für strahlende Schönheit.',
    icon: 'star',
  },
  {
    id: 'tip-004',
    title: 'Vor deinem nächsten Termin',
    content: 'Komme ungeschminkt zum Termin. So können wir direkt starten und du bekommst das beste Ergebnis.',
    icon: 'calendar',
  },
];

// Empty state variants for testing
export const emptyMockData = {
  treatments: [] as TreatmentHistory[],
  appointment: undefined as Appointment | undefined,
  products: [] as ProductPurchase[],
  careTips: [] as CareTip[],
};
