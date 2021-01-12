import { stompClient } from '../layers/authenticated-layer';
import { NOTES_URL } from '../bloben-common/globals/url';
import Axios from '../bloben-common/utils/axios';

export const APP_API_PREFIX: string = '/notes-app';
export const API_GET_CALENDAR_SETTINGS: string = 'settings';

export const WEBSOCKET_GET_ONE_NOTE: string = '/app/notes/get/one';
export const WEBSOCKET_GET_ALL_NOTES: string = '/app/notes/get/all';
export const WEBSOCKET_GET_NOTES: string = '/app/notes/get';
export const WEBSOCKET_CREATE_NOTE: string = '/app/notes/create';
export const WEBSOCKET_UPDATE_NOTE: string = '/app/notes/update';
export const WEBSOCKET_DELETE_NOTE: string = '/app/notes/delete';
export const WEBSOCKET_SYNC_NOTES: string = '/app/notes/sync';

export const WEBSOCKET_GET_ALL_TAGS: string = '/app/tags/get';
export const WEBSOCKET_GET_ONE_TAG: string = '/app/tags/get/one';
export const WEBSOCKET_CREATE_TAG: string = '/app/tags/create';
export const WEBSOCKET_UPDATE_TAG: string = '/app/tags/update';
export const WEBSOCKET_DELETE_TAG: string = '/app/tags/delete';
export const WEBSOCKET_SYNC_TAGS: string = '/app/tags/sync';

export const sendWebsocketMessage = (
  destination: string,
  data?: any | null
) => {
  stompClient.send(destination, {}, data ? JSON.stringify(data) : null);
};

const NotesApi = {
  /*
   * Get notes from server, check only new one after repeated attempts
   * Update timestamp of last server check
   */
  getNotes: async () => {
    // Try to load session from local database

    const getDataUrl: string = `/${NOTES_URL}/notes`;

    const result: any = (await Axios.get(getDataUrl)).data.data;

    // Update local session timestamp

    return result;
  },
  saveNote: async (itemLocal: any) => {
    const result: any = (await Axios.post(`/${NOTES_URL}/notes`, itemLocal))
      .data;

    return result;
  },
  updateNote: async (itemLocal: any) =>
    Axios.put(`/${NOTES_URL}/notes`, itemLocal),
  deleteNote: async (note: any) =>
    Axios.delete(`/${NOTES_URL}/notes`, { id: note.id }),
  saveTag: async (itemLocal: any) => {
    const result: any = (await Axios.post(`/${NOTES_URL}/tags`, itemLocal))
      .data;

    return result;
  },
  addTags: async (item: any) => {
    const result: any = (await Axios.post(`/${NOTES_URL}/notes/tags`, item))
      .data;

    return result;
  },
  getTags: async () => {
    const result: any = (await Axios.get(`/${NOTES_URL}/tags`)).data;

    return result;
  },
};

export default NotesApi;
