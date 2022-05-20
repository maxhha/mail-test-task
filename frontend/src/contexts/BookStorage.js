import axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { APIContext } from "./api";

/**
 * @typedef {Object} Book
 * @property {string} id
 */

/**
 * @typedef {Object} Record
 * @property {string} id
 */

/**
 * @typedef {Object} BookStorage
 * @property {Book} book
 * @property {Record[]} records
 * @property {boolean} loading
 * @property {boolean} hasMore
 * @property {(record: FormData) => Promise<void>} create
 * @property {() => void} loadMore
 * @property {(recordId: string) => void} markDone
 * @property {(recordId: string) => void} unmarkDone
 */
/** @type {any} */
const noop = () => {};

/** @type {BookStorage} */
const EMPTY_STORAGE = {
  book: { id: "" },
  records: [],
  loading: true,
  hasMore: false,
  create: noop,
  loadMore: noop,
  markDone: noop,
  unmarkDone: noop,
};

/** @type {import("react").Context<BookStorage>} */
export const BookStorageContext = React.createContext(EMPTY_STORAGE);

const Provider = BookStorageContext.Provider;

export function BookStorageContextProvider({ value: { bookId }, children }) {
  const [value, setValue] = useState(EMPTY_STORAGE);
  const { axios } = useContext(APIContext);

  //   const create = useCallback(
  //     async (record) => {
  //       axios.post(`/books/${bookId}/records/`, {});
  //     },
  //     [bookId]
  //   );

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`/books/${bookId}/records/`, { signal: controller.signal })
      .then(async ({ data }) => {
        setValue({
          book: { id: bookId },
          records: data.results,
          loading: false,
          hasMore: data.next !== null,
          create: noop,
          loadMore: noop,
          markDone: noop,
          unmarkDone: noop,
        });
      });

    return () => controller.abort();
  }, [bookId]);

  return <Provider value={value}>{children}</Provider>;
}

// @ts-ignore
BookStorageContext.Provider = BookStorageContextProvider;
