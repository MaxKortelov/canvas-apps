export function getRandomColor(): string {
  const red = Math.floor(Math.random() * 255);
  const green = Math.floor(Math.random() * 255);
  const blue = Math.floor(Math.random() * 255);

  // Color won't be transparent
  return `rgb(${red}, ${green}, ${blue})`;
}

export function createRGBAColor(r: number, g: number, b: number, a: number): string {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function createRGBColor(r: number, g: number, b: number, a: number): string {
  return `rgb(${r}, ${g}, ${b})`;
}
