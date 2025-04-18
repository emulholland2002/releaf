/**
 * CSS Utility Functions
 *
 * This file provides utility functions for handling CSS class names,
 * particularly for combining Tailwind CSS classes conditionally and
 * resolving conflicts between them.
 */

// Import clsx for conditionally joining class names
import { clsx, type ClassValue } from "clsx"

// Import tailwind-merge to handle Tailwind CSS class conflicts
import { twMerge } from "tailwind-merge"

/**
 * @param inputs - Any number of class values (strings, objects, arrays, etc.)
 * @returns A merged string of CSS classes with conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
