// Las patentes se guardan y se buscan sin espacios, guiones ni puntos y en
// mayúsculas: "ag 049-vr" y "AG049VR" son la misma patente.
export function normalizePlate(plate: string): string {
  return plate.toUpperCase().replace(/[^A-Z0-9]/g, "");
}
