// Funções mock para cidades

export function calculateCityRating(city: any): number {
  // Mock: retorna nota aleatória entre 1 e 5
  return Math.floor(Math.random() * 5) + 1;
}

export function formatPopulation(population: number): string {
  // Mock: formata população com separador de milhar
  return population.toLocaleString('en-US') + ' inhabitants';
}

export function formatCostOfLiving(cost: number): string {
  // Mock: formata custo de vida em dólares
  return `$${cost.toLocaleString('en-US')}`;
}

export function getMainDestinyCities(): Array<any> {
  // Mock: retorna lista de cidades exemplo
  return [
    { name: 'Miami', population: 470000, costOfLiving: 3200 },
    { name: 'Orlando', population: 290000, costOfLiving: 2500 },
    { name: 'New York', population: 8400000, costOfLiving: 5000 },
  ];
}
