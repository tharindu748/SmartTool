type ClassValue = string | number | boolean | undefined | null | Record<string, boolean> | ClassArray;
interface ClassArray extends Array<ClassValue> {}

/**
 * Tailwind-merge like utility for combining class names
 * @param inputs Class names to combine
 * @returns Combined class string
 */
export function cn(...inputs: ClassValue[]): string {
  let result: string[] = [];
  
  for (const input of inputs) {
    if (!input) continue;
    
    switch (typeof input) {
      case 'string':
        result.push(input);
        break;
      case 'object':
        if (Array.isArray(input)) {
          result.push(cn(...input));
        } else {
          for (const [key, value] of Object.entries(input)) {
            if (value) {
              result.push(key);
            }
          }
        }
        break;
    }
  }
  
  return result.join(' ');
}