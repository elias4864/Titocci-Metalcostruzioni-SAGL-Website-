import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Kontakt.jsx';
import StatCard from '../pages/StatCard.jsx';


expect.extend(matchers);


