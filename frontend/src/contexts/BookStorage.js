import axios from "axios";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
import { noop } from "utils/noop";
import { APIContext } from "./api";
import { ErrorContext } from "./error";

/**
 * @typedef {Object} Book
 * @property {string} id
 * @property {boolean} is_owner
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
 * @property {(recordId: string) => Promise<void>} markDone
 * @property {(recordId: string) => Promise<void>} unmarkDone
 */

/** @type {BookStorage} */
const EMPTY_STORAGE = {
  book: { id: "", is_owner: false },
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

function updateRecordDone(records, recordId, done) {
  return records.map((record) =>
    record.id === recordId ? { ...record, done } : record
  );
}

export function BookStorageContextProvider({ value: { bookId }, children }) {
  const { onError } = useContext(ErrorContext);
  const [value, setValue] = useState(EMPTY_STORAGE);
  const loading = useRef(false);
  const { api } = useContext(APIContext);
  const history = useHistory();

  const create = useCallback(
    async (record) => {
      await api.postForm(`books/${bookId}/records/`, record);
    },
    [bookId]
  );

  const updateDone = useCallback(
    async (recordId, done) => {
      await api.patch(`books/${bookId}/records/${recordId}/`, { done });

      setValue((value) => ({
        ...value,
        records: updateRecordDone(value.records, recordId, done),
      }));
    },
    [bookId]
  );

  const markDone = useCallback(
    (recordId) => {
      return updateDone(recordId, true);
    },
    [bookId]
  );

  const unmarkDone = useCallback(
    async (recordId) => {
      return updateDone(recordId, false);
    },
    [bookId]
  );

  useEffect(() => {
    if (value !== EMPTY_STORAGE) {
      setValue(EMPTY_STORAGE);
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const load = (url) => {
      if (loading.current) {
        return;
      }
      loading.current = true;

      setValue((value) => ({
        ...value,
        loading: true,
      }));

      api
        .get(url, { signal })
        .then(async ({ data }) => {
          const next = data.next;
          setValue((value) => ({
            ...value,
            records: [...value.records, ...data.results],
            loading: false,
            hasMore: next !== null,
            loadMore: next ? () => load(next) : noop,
          }));
        })
        .catch((error) => {
          if (!axios.isCancel(error)) {
            onError(error);
          }
        })
        .finally(() => {
          loading.current = false;
        });
    };

    (async () => {
      const { data: book } = await api.get(`/books/${bookId}/`, { signal });

      setValue((value) => ({
        ...value,
        book,
      }));

      const {
        data: { next, results },
      } = await api.get(`/books/${bookId}/records/?page_size=12`, { signal });

      setValue((value) => ({
        ...value,
        records: results,
        loading: false,
        hasMore: next !== null,
        loadMore: next ? () => load(next) : noop,
      }));
    })().catch((error) => {
      if (axios.isCancel(error)) {
        return;
      }

      history.replace("/");
      onError(error);
    });

    return () => controller.abort();
  }, [bookId, onError]);

  useEffect(() => {
    if (!value.book.id) {
      return;
    }

    const eventSource = new EventSource(
      `${process.env.REACT_APP_API_URL}/books/${value.book.id}/sse`,
      {
        withCredentials: true,
      }
    );

    eventSource.addEventListener(
      "error",
      (error) => {
        this.eventSource.close();

        onError(error);
      },
      { once: true }
    );

    eventSource.addEventListener("record_created", (event) => {
      let record;
      try {
        record = JSON.parse(event.data);
      } catch (error) {
        onError(error);
        return;
      }
      setValue((value) => ({
        ...value,
        records: [record, ...value.records],
      }));
    });

    eventSource.addEventListener("record_updated", (event) => {
      let record;
      try {
        record = JSON.parse(event.data);
      } catch (error) {
        onError(error);
        return;
      }

      setValue((value) => ({
        ...value,
        records: value.records.map((r) => {
          if (r.id === record.id) {
            return record;
          } else {
            return r;
          }
        }),
      }));
    });

    return () => eventSource.close();
  }, [value.book.id, onError]);

  const passedValue = value.book.id
    ? { ...value, create, markDone, unmarkDone }
    : value;

  return <Provider value={passedValue}>{children}</Provider>;
}

// @ts-ignore
BookStorageContext.Provider = BookStorageContextProvider;
