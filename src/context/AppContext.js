import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { ActivityIndicator, View } from 'react-native';

import { DEFAULT_DRAFT, newId } from '../utils/calc';
import { DEFAULT_CURRENCY, CURRENCIES } from '../utils/format';
import { loadPersisted, savePersisted } from '../utils/storage';
import { colors } from '../theme';

const HISTORY_LIMIT = 100;

const initialState = {
  loaded: false,
  history: [],
  saved: [],
  currency: DEFAULT_CURRENCY,
  draft: DEFAULT_DRAFT,
  current: null, // trip currently shown in the result card (not persisted)
};

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': {
      const data = action.payload || {};
      const currency = CURRENCIES.some((c) => c.code === data.currency)
        ? data.currency
        : DEFAULT_CURRENCY;
      return {
        ...state,
        loaded: true,
        history: Array.isArray(data.history) ? data.history : [],
        saved: Array.isArray(data.saved) ? data.saved : [],
        currency,
        draft:
          data.draft && typeof data.draft === 'object'
            ? { ...DEFAULT_DRAFT, ...data.draft }
            : DEFAULT_DRAFT,
      };
    }
    case 'SET_DRAFT':
      return { ...state, draft: { ...state.draft, ...action.payload }, current: null };
    case 'RESET_DRAFT':
      return { ...state, draft: DEFAULT_DRAFT, current: null };
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload, current: null };
    case 'SET_CURRENT':
      return { ...state, current: action.payload };
    case 'ADD_HISTORY':
      return {
        ...state,
        history: [action.payload, ...state.history].slice(0, HISTORY_LIMIT),
      };
    case 'DELETE_HISTORY':
      return { ...state, history: state.history.filter((t) => t.id !== action.payload) };
    case 'CLEAR_HISTORY':
      return { ...state, history: [] };
    case 'ADD_SAVED':
      return { ...state, saved: [action.payload, ...state.saved] };
    case 'DELETE_SAVED':
      return { ...state, saved: state.saved.filter((t) => t.id !== action.payload) };
    case 'LOAD_TRIP':
      return {
        ...state,
        draft: { ...DEFAULT_DRAFT, ...action.payload.inputs },
        currency: action.payload.currency,
        current: action.payload,
      };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const saveTimer = useRef(null);

  // Load persisted data once.
  useEffect(() => {
    let active = true;
    loadPersisted().then((data) => {
      if (active) dispatch({ type: 'HYDRATE', payload: data });
    });
    return () => {
      active = false;
    };
  }, []);

  // Persist (debounced) whenever data changes.
  useEffect(() => {
    if (!state.loaded) return undefined;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      savePersisted({
        history: state.history,
        saved: state.saved,
        currency: state.currency,
        draft: state.draft,
      });
    }, 300);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state.loaded, state.history, state.saved, state.currency, state.draft]);

  const setDraft = useCallback((patch) => dispatch({ type: 'SET_DRAFT', payload: patch }), []);
  const resetDraft = useCallback(() => dispatch({ type: 'RESET_DRAFT' }), []);
  const setCurrency = useCallback((code) => dispatch({ type: 'SET_CURRENCY', payload: code }), []);
  const setCurrent = useCallback((trip) => dispatch({ type: 'SET_CURRENT', payload: trip }), []);
  const addHistory = useCallback((trip) => dispatch({ type: 'ADD_HISTORY', payload: trip }), []);
  const deleteHistory = useCallback((id) => dispatch({ type: 'DELETE_HISTORY', payload: id }), []);
  const clearHistory = useCallback(() => dispatch({ type: 'CLEAR_HISTORY' }), []);
  const deleteSaved = useCallback((id) => dispatch({ type: 'DELETE_SAVED', payload: id }), []);
  const loadTrip = useCallback((trip) => dispatch({ type: 'LOAD_TRIP', payload: trip }), []);
  const addSaved = useCallback((trip, name) => {
    const cleanName = String(name || '').trim().slice(0, 40) || 'Saved trip';
    dispatch({
      type: 'ADD_SAVED',
      payload: { ...trip, id: newId(), name: cleanName, savedAt: Date.now() },
    });
  }, []);

  const value = useMemo(
    () => ({
      state,
      setDraft,
      resetDraft,
      setCurrency,
      setCurrent,
      addHistory,
      deleteHistory,
      clearHistory,
      addSaved,
      deleteSaved,
      loadTrip,
    }),
    [
      state,
      setDraft,
      resetDraft,
      setCurrency,
      setCurrent,
      addHistory,
      deleteHistory,
      clearHistory,
      addSaved,
      deleteSaved,
      loadTrip,
    ]
  );

  if (!state.loaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary,
        }}
      >
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
