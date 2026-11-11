"use client";

import PageLoader from "@/components/Loading/PageLoader";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";


const LOADERS = {
  overlay: PageLoader,
};

const DEFAULT_VARIANT = "overlay";

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [loads, setLoads] = useState([]); 
  const nextId = useRef(0);

  const showLoading = useCallback(
    ({ variant = DEFAULT_VARIANT, message = "Cargando..." } = {}) => {
      const id = ++nextId.current;
      setLoads((prev) => [...prev, { id, variant, message }]);
      return id; 
    },
    [],
  );

  const hideLoading = useCallback((id) => {
    setLoads((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const withLoading = useCallback(
    async (promiseOrFn, options) => {
      const id = showLoading(options);
      try {
        return await (typeof promiseOrFn === "function"
          ? promiseOrFn()
          : promiseOrFn);
      } finally {
        hideLoading(id);
      }
    },
    [showLoading, hideLoading],
  );

  const current = loads[loads.length - 1];
  const Loader = current
    ? (LOADERS[current.variant] ?? LOADERS[DEFAULT_VARIANT])
    : null;

  return (
    <LoadingContext.Provider
      value={{
        isLoading: loads.length > 0,
        showLoading,
        hideLoading,
        withLoading,
      }}
    >
      {children}
      {Loader && <Loader message={current.message} />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx)
    throw new Error("useLoading debe usarse dentro de <LoadingProvider>");
  return ctx;
}
