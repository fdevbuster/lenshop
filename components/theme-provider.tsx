import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export async function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider enableSystem={true}
  defaultTheme="system"
  attribute="class" {...props}>{children}</NextThemesProvider>
}
