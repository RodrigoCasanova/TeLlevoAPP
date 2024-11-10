export interface Ride {
    destination: string;
    startLocation: string;
    departureTime: Date;
    seats: number;
    costPerKm: number;
    costType: string; // 'perKm' o 'fixed'
    carPlate?: string;
  }
  