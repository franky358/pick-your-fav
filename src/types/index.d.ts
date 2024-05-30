// src/types/index.d.ts

export interface Option {
  id: string; // Asegurarse de que esto sea `string`
  title: string;
  url: string;
  comparison_id?: string;
  user_id?: string;
}


export interface Comparison {
  id: number;
  title?: string;
  options?: Option[];  
  votedOptionId?: number | null;
}



