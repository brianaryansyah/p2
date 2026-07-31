import { useSyncExternalStore } from 'react';
import {
  getPortfolioData,
  subscribePortfolio,
  setPortfolioSection,
  setPortfolioData,
  resetPortfolioData,
} from '../data/portfolioStore';

export function usePortfolioData() {
  const data = useSyncExternalStore(subscribePortfolio, getPortfolioData);
  return [data, setPortfolioSection, setPortfolioData, resetPortfolioData];
}
