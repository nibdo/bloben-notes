import { stompClient } from '../layers/authenticated-layer';
import {
    sendWebsocketMessage,
    WEBSOCKET_GET_ONE_TAG, WEBSOCKET_GET_ONE_NOTE, WEBSOCKET_CREATE_NOTE
} from '../api/notes';
import { GetNoteWebsocketDTO } from '../types/types';
import { isBefore, parseISO } from 'date-fns';
import NoteStateEntity, { NoteBodyToSend } from '../data/entities/state/note.entity';
import { findInArrayById } from '../bloben-package/utils/common';
import { addNote, addTag, deleteNote, setNotes, setTags } from '../redux/actions';
import { decryptNotes } from './decryptNotes';
import TagStateEntity from '../data/entities/state/tag.entity';
import { decryptTags } from './decryptTags';
import { reduxStore } from '../bloben-package/layers/ReduxLayer';

// Message constants
const WEBSOCKET_NOTE_MESSAGE: WebsocketMessageType = 'note'
const WEBSOCKET_TAG_MESSAGE: WebsocketMessageType = 'tag'
type WebsocketMessageType = 'note' | 'tag';

// Action constants
const WEBSOCKET_CREATE_ACTION: WebsocketCrudAction = 'create';
const WEBSOCKET_UPDATE_ACTION: WebsocketCrudAction = 'update';
const WEBSOCKET_DELETE_ACTION: WebsocketCrudAction = 'delete';
const WEBSOCKET_SYNC_ACTION: WebsocketCrudAction = 'sync';
const WEBSOCKET_CREATE_FROM_CLIENT_ACTION: WebsocketCrudAction = 'createFromClient';
const WEBSOCKET_UPDATE_FROM_CLIENT_ACTION: WebsocketCrudAction = 'updateFromClient';

type WebsocketCrudAction = 'create' | 'update' | 'delete' | 'sync' | 'createFromClient' | 'updateFromClient';

const WebsocketHandler = {
    /**
     * Filter and process messages from sync subscription after CRUD actions
     * @param message
     */
    handleSyncGeneral: async (message: any): Promise<void> => {
        const messageObj: any = JSON.parse(message.body);

        // Get message type
        const messageType: WebsocketMessageType = messageObj.type;

        // Process different messages types
        switch (messageType) {
            case WEBSOCKET_NOTE_MESSAGE:
                await WebsocketHandler.handleNoteSync(messageObj);
                break;
            case WEBSOCKET_TAG_MESSAGE:
                await WebsocketHandler.handleTagSync(messageObj);
                break;
            default:
                await WebsocketHandler.handleSyncGeneralArray(messageObj);
        }
    },
    handleSyncGeneralArray: async (message: any): Promise<void> => {

        for (const messageObj of message) {
            // Get message type
            const messageType: WebsocketMessageType = messageObj.type;

            // Process different messages types
            switch (messageType) {
                case WEBSOCKET_NOTE_MESSAGE:
                    await WebsocketHandler.handleNoteSync(messageObj);
                    break;
                case WEBSOCKET_TAG_MESSAGE:
                    await WebsocketHandler.handleTagSync(messageObj);
                    break;
                default:
            }
        }
    },
    /**
     * Process note sync actions
     * @param messageObj
     */
    handleNoteSync: async (messageObj: any) => {
        console.log('AAA', messageObj)
        const action: WebsocketCrudAction = messageObj.action;

        // Filter actions
        switch (action) {
            case WEBSOCKET_CREATE_ACTION:
                await WebsocketHandler.handleCreateNoteMessage(messageObj);
                break;
            case WEBSOCKET_UPDATE_ACTION:
                await WebsocketHandler.handleUpdateNoteMessage(messageObj);
                break;
            case WEBSOCKET_DELETE_ACTION:
                WebsocketHandler.handleDeleteNoteMessage(messageObj);
                break;
            case WEBSOCKET_SYNC_ACTION:
                await WebsocketHandler.handleSyncNoteMessage(messageObj);
                break;
            case WEBSOCKET_CREATE_FROM_CLIENT_ACTION:
                await WebsocketHandler.handleCreateFromClientNoteMessage(messageObj);
                break;
            default:
        }
    },
    /**
     * Process tag sync actions
     * @param messageObj
     */
    handleTagSync: async (messageObj: any) => {
        const action: WebsocketCrudAction = messageObj.action;
        // Filter actions
        switch (action) {
            case WEBSOCKET_CREATE_ACTION:
                await WebsocketHandler.handleCreateTagMessage(messageObj);
                break;
            case WEBSOCKET_UPDATE_ACTION:
                await WebsocketHandler.handleUpdateTagMessage(messageObj);
                break;
            case WEBSOCKET_DELETE_ACTION:
                await WebsocketHandler.handleDeleteTagMessage(messageObj);
                break;
            case WEBSOCKET_SYNC_ACTION:
                await WebsocketHandler.handleSyncTagMessage(messageObj);
                break;
            default:
        }
    },
    handleSyncNoteMessage: async (messageObj: any): Promise<void> => {
        if (!messageObj.data || messageObj.data.length === 0) {
            return;
        }
        for (const item of messageObj.data) {
            await WebsocketHandler.handleNoteSync(item);
        }
    },
    handleSyncTagMessage: async (messageObj: any): Promise<void> => {
        if (!messageObj.data || messageObj.data.length === 0) {
            return;
        }
        for (const item of messageObj.data) {
            await WebsocketHandler.handleTagSync(item);
        }
    },
    handleCreateTagMessage: async (item: any): Promise<void> => {
        const store: any = reduxStore.getState();
        const {tags} = store;
        const tagInState: TagStateEntity | null = await findInArrayById(tags, item.id);

        if (!tagInState) {
            sendWebsocketMessage(WEBSOCKET_GET_ONE_TAG, {id: item.id});
        }
    },
    handleUpdateTagMessage: async (item: any): Promise<void> => {
        const store: any = reduxStore.getState();
        const {tags} = store;

        const {id, updatedAt} = item;

        // Find if tag is in state
        const tagInState: TagStateEntity | null = await findInArrayById(tags, id);

        // Get tag from server if not found or if it is older
        if (!tagInState ||
            isBefore(tagInState.updatedAt, parseISO(updatedAt))) {
            // Construct request event body
            sendWebsocketMessage(WEBSOCKET_GET_ONE_TAG, {id});
        } else {
            // Flag found state item as synced
            const tagToUpdate: TagStateEntity = TagStateEntity.flagAsSynced(tagInState);
        }
    },
    handleDeleteTagMessage: async (item: any): Promise<void> => {
        const store: any = reduxStore.getState();
        const {tags} = store;

        const {id} = item;

        const tagInState: TagStateEntity | null = await findInArrayById(tags, id);

        // TODO DELETE TAG and clear from notes
        // if (tagInState) {
        //     handleCalendarReduxDelete(id)
        // }
    },
    handleCreateNoteMessage: async (item: any): Promise<void> => {
        const store: any = reduxStore.getState();
        const {id, updatedAt} = item;
        // Find if note is in state
        const noteInState: NoteStateEntity | null = await findInArrayById(store.notes, id);

        // Get note from server if not found, if needed to fetch all occurrences or is older
        if (!noteInState
            || noteInState.updatedAt !== updatedAt) {
            // Construct request note body
            const requestNoteDataById: GetNoteWebsocketDTO = {
                id,
            }

            sendWebsocketMessage(WEBSOCKET_GET_ONE_NOTE, requestNoteDataById);
        } else {
            // Flag found state item as synced
            // TODO flag as synced
            // eventInState.flagAsSynced();
        }
    },
    handleUpdateNoteMessage: async (item: any): Promise<void> => {
        const store: any = reduxStore.getState();

        const {id, updatedAt} = item;

        // Find if note is in state
        const noteInState: NoteStateEntity | null = await findInArrayById(store.notes, id);

        if (!noteInState ||
            noteInState && (isBefore(noteInState.updatedAt, parseISO(updatedAt)))) {
            // Construct request note body
            const requestNoteDataById: GetNoteWebsocketDTO = {
                id,
            }
            sendWebsocketMessage(WEBSOCKET_GET_ONE_NOTE, requestNoteDataById);
        } else {
            // Flag found state item as synced
            // TODO flag as synced
            // eventInState.flagAsSynced();
        }
    },
    handleDeleteNoteMessage: (messageObj: any): void => {
        reduxStore.dispatch(deleteNote(messageObj));
    },
    handleCreateFromClientNoteMessage: async (item: any): Promise<void> => {
        const store: any = reduxStore.getState();
        const {notes, pgpKeys} = store;

        const {id} = item;

        // Find item in state
        const note: any = await findInArrayById(notes, id);

        const newNote: NoteStateEntity = new NoteStateEntity(note);
        // Encrypt data
        const bodyToSend: NoteBodyToSend = await newNote.formatBodyToSendOpenPgp(pgpKeys)

        sendWebsocketMessage(WEBSOCKET_CREATE_NOTE, bodyToSend);
    },
    getNotes: async (message: string) => {
        const objParsed: any = JSON.parse(message);
        const {type, data} = objParsed;
        console.log('objParsed', objParsed)
        // Process and decode notes
        // tslint:disable-next-line:prefer-switch
        if (type === 'notes' || type === 'note') {
            await decryptNotes(data);
        }
    },
    getTags: async (message: string) => {
        const objParsed: any = JSON.parse(message);
        const {type, data} = objParsed;
        // Process and decode tags
        // tslint:disable-next-line:prefer-switch
        if (type === 'tags' || type === 'tag') {
            await decryptTags(data);
        }
    },
    getUpdate: async  (setState: any, message: string, state: any) => {
        const {data, rangeFrom, rangeTo} = state;

        const objParsed: any = JSON.parse(message);

        // Get first and last day of events range
        stompClient.send('/app/notes/get/one', {}, JSON.stringify(
            {id: objParsed.id}
        ));

    }
}

export default WebsocketHandler;
