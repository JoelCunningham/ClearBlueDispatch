export function getFullName(customerName: string, address: string): string {
  const addressParts = address.split(",").map(part => part.trim());
  const suburb = addressParts.length >= 3 ? addressParts[addressParts.length - 3] : address;
  return `${customerName} (${suburb})`;
}

export function getFirstLetter(name: string): string | undefined {
  if (!name || name.length === 0) return undefined;
  const firstChar = name.charAt(0).toUpperCase();
  return firstChar >= "A" && firstChar <= "Z" ? firstChar : "#";
}
