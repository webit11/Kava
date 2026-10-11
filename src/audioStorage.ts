const DB_NAME = 'kava_audio_db';
const STORE_NAME = 'audio_files';
const DB_VERSION = 1;

export interface AudioFileData {
  id: string; // "audio-${eventId}"
  fileName: string;
  fileSize: string;
  fileDuration: string;
  blob: Blob;
  timestamp: number;
}

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export async function saveAudioFile(
  eventId: string,
  fileName: string,
  fileSize: string,
  fileDuration: string,
  blob: Blob
): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const data: AudioFileData = {
      id: `audio-${eventId}`,
      fileName,
      fileSize,
      fileDuration,
      blob,
      timestamp: Date.now()
    };
    const request = store.put(data);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getAudioFile(eventId: string): Promise<AudioFileData | null> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(`audio-${eventId}`);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  } catch (e) {
    console.error('Error reading from IndexedDB:', e);
    return null;
  }
}

export async function deleteAudioFile(eventId: string): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(`audio-${eventId}`);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (e) {
    console.error('Error deleting from IndexedDB:', e);
  }
}
