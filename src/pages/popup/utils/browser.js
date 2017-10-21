import { deletedTabsCache } from '../caches';
import { removeElementFromTabList } from './dom';

export function addTabsToPromiseChain(store) {
  const { getState } = store;
  const { searchAllWindows } = getState().general;
  const tabQueryOptions = {};
  if (!searchAllWindows) {
    tabQueryOptions.currentWindow = true;
  }
  return browser.tabs.query(tabQueryOptions)
    .then(tabs => Object.assign({}, store, { loadedTabs: tabs }))
    .catch((e) => {
      throw new Error(`
        Problem adding tabs to promise chain during popup initialization: ${e}
      `);
    });
}

export function restoreClosedTab(id) {
  browser.sessions.restore(id);
  window.close();
}

export function deleteTab(elementToRemove, wasClicked = false) {
  const { id } = elementToRemove.dataset;
  // Cache the deleted tabId since the current store passed into configureSearch
  // isn't updated with the latest tabs after tab deletion`
  const tabId = parseInt(id, 10);
  removeElementFromTabList(elementToRemove, wasClicked);
  deletedTabsCache().push(tabId);
  browser.tabs.remove(tabId);
}