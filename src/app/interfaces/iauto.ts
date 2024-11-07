// src/app/interfaces/iauto.ts

export interface IAuto {
  id?: string;
  brand: string;
  model: string;
  year: string;
  color: string;
  plate: string;
  description?: string; // El campo description es opcional
  selected?: boolean;
}
