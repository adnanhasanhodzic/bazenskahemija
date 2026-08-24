import { Pool } from '../types/pool';

const POOLS_LIST_KEY = 'bazen_kalkulator_pools_list';
const ACTIVE_POOL_ID_KEY = 'bazen_kalkulator_active_pool_id';

/**
 * Retrieves all saved pools from localStorage.
 * Returns an empty array if no pools are saved.
 */
export function getSavedPools(): Pool[] {
  try {
    const data = localStorage.getItem(POOLS_LIST_KEY);
    if (!data) return [];
    const pools = JSON.parse(data) as Pool[];
    return Array.isArray(pools) ? pools : [];
  } catch (error) {
    console.error('Greška pri čitanju liste bazena:', error);
    return [];
  }
}

/**
 * Retrieves the currently active pool ID.
 */
export function getActivePoolId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_POOL_ID_KEY) || null;
  } catch (error) {
    console.error('Greška pri čitanju aktivnog ID-ja bazena:', error);
    return null;
  }
}

/**
 * Sets the active pool ID in localStorage.
 */
export function setActivePoolId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_POOL_ID_KEY, id);
  } catch (error) {
    console.error('Greška pri postavljanju aktivnog ID-ja bazena:', error);
  }
}

/**
 * Returns the active Pool object, or the first available pool if active ID is invalid,
 * or null if no pools exist.
 */
export function getActivePool(): Pool | null {
  const pools = getSavedPools();
  if (pools.length === 0) return null;

  const activeId = getActivePoolId();
  if (activeId) {
    const found = pools.find((p) => p.id === activeId);
    if (found) return found;
  }

  // Fallback to first pool and update active ID
  const firstPool = pools[0];
  setActivePoolId(firstPool.id);
  return firstPool;
}

/**
 * Saves a new pool or updates an existing pool.
 * Returns the updated pools list and active pool ID.
 */
export function saveOrUpdatePool(pool: Pool): { pools: Pool[]; activePoolId: string } {
  try {
    const currentPools = getSavedPools();
    const existingIndex = currentPools.findIndex((p) => p.id === pool.id);

    let updatedPools: Pool[];
    if (existingIndex >= 0) {
      // Update existing pool
      updatedPools = [...currentPools];
      updatedPools[existingIndex] = {
        ...pool,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Add new pool
      updatedPools = [
        ...currentPools,
        {
          ...pool,
          createdAt: pool.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    }

    localStorage.setItem(POOLS_LIST_KEY, JSON.stringify(updatedPools));

    // If it's the only pool or user is creating/updating, make it active
    const currentActiveId = getActivePoolId();
    const activeId = currentActiveId && existingIndex >= 0 ? currentActiveId : pool.id;
    setActivePoolId(activeId);

    return { pools: updatedPools, activePoolId: activeId };
  } catch (error) {
    console.error('Greška pri spremanju bazena:', error);
    return { pools: getSavedPools(), activePoolId: pool.id };
  }
}

/**
 * Deletes a pool by ID. If the deleted pool was active, selects another pool as active.
 * Returns the remaining pools and new active pool ID.
 */
export function deletePool(id: string): { pools: Pool[]; newActivePoolId: string | null } {
  try {
    const currentPools = getSavedPools();
    const filteredPools = currentPools.filter((p) => p.id !== id);

    localStorage.setItem(POOLS_LIST_KEY, JSON.stringify(filteredPools));

    const currentActiveId = getActivePoolId();
    let newActivePoolId: string | null = null;

    if (currentActiveId === id) {
      if (filteredPools.length > 0) {
        newActivePoolId = filteredPools[0].id;
        setActivePoolId(newActivePoolId);
      } else {
        localStorage.removeItem(ACTIVE_POOL_ID_KEY);
        newActivePoolId = null;
      }
    } else {
      newActivePoolId = currentActiveId;
    }

    return { pools: filteredPools, newActivePoolId };
  } catch (error) {
    console.error('Greška pri brisanju bazena:', error);
    return { pools: getSavedPools(), newActivePoolId: null };
  }
}

/**
 * Clears all pools and active pool selection from localStorage.
 */
export function clearAllPools(): void {
  try {
    localStorage.removeItem(POOLS_LIST_KEY);
    localStorage.removeItem(ACTIVE_POOL_ID_KEY);
  } catch (error) {
    console.error('Greška pri brisanju svih bazena:', error);
  }
}
