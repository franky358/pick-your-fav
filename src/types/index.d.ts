// Definición del tipo para una Opción
interface Option {
    id: number;
    title?: string;
    url: string;
  }
  
  // Definición del tipo para una Comparación
  interface Comparison {
    id: number;
    title?: string;
    options: Option[];
    votedOptionId: number | null; // id de la opción votada (null si no se ha votado)
  }
  