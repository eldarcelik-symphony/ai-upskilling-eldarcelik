// Pre-compiled regex for better performance
const SNAKE_CASE_REGEX = /_([a-zA-Z0-9])/g;

/**
 * Converts a snake_case string to camelCase
 * @param str - The snake_case string to convert
 * @returns The camelCase string
 */
function snakeToCamel(str: string): string {
  // Use pre-compiled regex for better performance
  return str.replace(SNAKE_CASE_REGEX, (_, char) => char.toUpperCase());
}

/**
 * Converts an object with snake_case keys to camelCase keys
 * Handles all data structures and depths comprehensively
 * @param obj - The object with snake_case keys
 * @returns A new object with camelCase keys
 */
function convertKeysToCamelCase<T>(obj: any): T {
  // Handle null and undefined
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle primitive types
  if (typeof obj !== 'object') {
    return obj;
  }

  // Handle Date objects
  if (obj instanceof Date) {
    return obj as T;
  }

  // Handle RegExp objects
  if (obj instanceof RegExp) {
    return obj as T;
  }

  // Handle Map objects
  if (obj instanceof Map) {
    const convertedMap = new Map();
    const entries = obj.entries();
    let entry = entries.next();
    while (!entry.done) {
      const [key, value] = entry.value;
      const camelKey = typeof key === 'string' ? snakeToCamel(key) : key;
      convertedMap.set(camelKey, convertKeysToCamelCase(value));
      entry = entries.next();
    }
    return convertedMap as T;
  }

  // Handle Set objects
  if (obj instanceof Set) {
    const convertedSet = new Set();
    const values = obj.values();
    let value = values.next();
    while (!value.done) {
      convertedSet.add(convertKeysToCamelCase(value.value));
      value = values.next();
    }
    return convertedSet as T;
  }

  // Handle Array objects
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamelCase(item)) as T;
  }

  // Handle plain objects
  if (obj.constructor === Object) {
    const converted: any = {};

    for (const [key, value] of Object.entries(obj)) {
      const camelKey = snakeToCamel(key);
      converted[camelKey] = convertKeysToCamelCase(value);
    }

    return converted as T;
  }

  // Handle other object types (like custom classes)
  // Create a new instance and copy properties
  try {
    const converted = new obj.constructor();

    for (const [key, value] of Object.entries(obj)) {
      const camelKey = snakeToCamel(key);
      converted[camelKey] = convertKeysToCamelCase(value);
    }

    return converted as T;
  } catch {
    // If we can't create a new instance, return the original object
    return obj;
  }
}

/**
 * Converts API response data from snake_case to camelCase
 * This is useful for converting TMDB API responses to camelCase format
 * @param data - The API response data
 * @returns The converted data with camelCase keys
 */
export function convertApiResponse<T>(data: any): T {
  return convertKeysToCamelCase<T>(data);
}
