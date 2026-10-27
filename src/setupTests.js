import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

// Erweitert Vitest global um alle Jest-DOM Matcher (z.B. toBeInTheDocument)
expect.extend(matchers);