import { v4 } from 'uuid';
import OpenPgp, { PgpKeys } from '../../../bloben-package/utils/OpenPgp';
import { parseDateToString, parseToDate } from '../../../bloben-package/utils/common';

export type NotesStateType = 'tasks';
export const NOTES_STATE: string = 'tasks';


export type TextNoteData = string;
export type TasksNoteData = TaskNote[];

export type TaskNote = {
  id: string;
  isCompleted: boolean;
  text: string;
};

export type NoteTypes = 'text' | 'tasks';

export const TEXT_NOTE_DATA: string = 'text';
export const TASKS_NOTE_DATA: string = 'tasks';

export const NOTE_TYPES: NoteTypes = 'text' || 'tasks';


export type NoteStateType = {
  id: string;
  title: string;
  text: string;
  body: any;
  tags: any;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  // App state
  isLocal: boolean;
  isSynced: boolean;
};

/**
 * Private part for encryption
 */
export type NotePropsForEncryption = {
  title: string;
  text: string;
  body: any;
};

/**
 * Body to save in server
 */
export type NoteBodyToSend = {
  id: string;
  tags: any;
  data: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export default class NoteStateEntity {
  id: string;
  tags: any;
  title: string;
  body: any;
  text: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null = null;
  isLocal: boolean;
  isSynced: boolean;
  constructor(data: any) {
    const isNotNew: boolean = data.id;

    this.id = isNotNew ? data.id : v4();
    this.title = data.title;
    this.text = data.text;
    this.body = data.body;
    this.tags = data.tags;
    this.isPinned = data.isPinned ? data.isPinned : false;
    this.createdAt = data.createdAt ? parseToDate(data.createdAt) : new Date();
    this.updatedAt = isNotNew ? new Date() : this.createdAt;
    this.deletedAt = data.deletedAt ? data.deletedAt : null;
    this.isLocal = !isNotNew;
    this.isSynced = isNotNew;
  }

  public createFromEncrypted = (encryptedNote: any, decryptedData: any) => {
    this.id = encryptedNote.id
    this.title = decryptedData.title;
    this.text = decryptedData.text;
    this.body = decryptedData.body;
    this.isPinned = encryptedNote.isPinned;
    this.tags = encryptedNote.tags;
    this.createdAt = parseToDate(encryptedNote.createdAt);
    this.updatedAt = parseToDate(encryptedNote.updatedAt);
    this.isLocal = false;
    this.isSynced = true;
  }

  public getReduxStateObj = (): any =>
      ({
        id: this.id,
        title: this.title,
        text: this.text,
        body: this.body,
        tags: this.tags,
        isPinned: this.isPinned,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        deletedAt: this.deletedAt,
        isLocal: this.isLocal,
        isSynced: this.isSynced,
      })

  public static flagAsSynced = (note: NoteStateEntity): NoteStateEntity => {
    note.isSynced = true;
    note.isLocal = false;

    return note;
  }
  public delete = (): void => {
    this.deletedAt = new Date();
  }

  /**
   * Get only private parts of event for encryption
   */
  public getNotePropsForEncryption = (): NotePropsForEncryption =>
      ({
        title: this.title,
        text: this.text,
        body: this.body
      })

  public formatBodyToSendOpenPgp = async (pgpKeys: PgpKeys): Promise<NoteBodyToSend> => {
    const data: any = await OpenPgp.encrypt(pgpKeys.publicKey, this.getNotePropsForEncryption());

    return   (
        {
          id: this.id,
          tags: this.tags,
          data,
          isPinned: this.isPinned,
          createdAt: parseDateToString(this.createdAt),
          updatedAt: parseDateToString(this.updatedAt),
        }
    )
  }

  /////
  static getNotes(tagId: string, notes: any) {
    if (!tagId) {
      return notes;
    }

    return notes.filter((note: any) => note.tags.indexOf(tagId) !== -1);
  }

  static getPinned(items: any) {
    const result: any = [];
    if (items.length === 0) {
      return result;
    }
    //&& isFuture(parseISO(task.remindAt)
    for (const [index, item] of items.entries()) {
      if (item.isPinned) {
        result.push(item);
      }
      if (index + 1 === item.length) {
        return result;
      }
    }
    const finalResult: any = result.sort((a: any, b: any) =>
      new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());

    return finalResult.slice(0, 3);
  }

  static sort = (data: any, rule: string) =>
    new Promise((resolve) => {
      let sortedData: any = [];

      if (!data || data.length === 0) {
        resolve(sortedData)
      }

      switch (rule) {
        case 'updatedAt':
          sortedData = data.sort((a: any, b: any) => {
            const aItem: any = a.updatedAt;
            const bItem: any = b.updatedAt;

            return bItem - aItem;
          });
          resolve(sortedData);

          return
        default:
          sortedData = data.sort((a: any, b: any) => {
            const aItem: any = a.updatedAt;
            const bItem: any = b.updatedAt;

            return bItem - aItem;
          });
          resolve(sortedData);

          return
      }
      // resolve(sortedData);
    });
  static getOrder = async (data: any, rule: string = 'updatedAt') =>
    new Promise(async (resolve) => {
      const pinnedNotes: any = [];
      const normalNotes: any = [];
      let pinnedNotesSorted: any;
      let normalNotesSorted: any;
      let result: any;

      if (!data || data.length === 0) {
        resolve([])
      }
      // Sort each note based on status
      for (let i = 0; i < data.length; i += 1) {
        const item: NoteStateEntity = data[i];

        if (item.isPinned) {
          pinnedNotes.push(item);
        } else {
          normalNotes.push(item);
        }
        // Sort each array based on set rule
        if (i + 1 === data.length) {
          pinnedNotesSorted = await NoteStateEntity.sort(pinnedNotes, rule);
          normalNotesSorted = await NoteStateEntity.sort(normalNotes, rule);
          result = pinnedNotesSorted.concat(normalNotesSorted);
          resolve(result);
        }
      }
    });

  static onChange = (event: any, setLocalStateState: any, text: string) => {
    const target = event.target;
    const name = target.name;

    if (!text) {
      setLocalStateState('text', event.target.value);

      return;
    }

    // Get index of title
    const index: number = text.indexOf('\n');

    if (index === -1) {
      setLocalStateState('text', event.target.value);

      return;
    }

    // Handle title change, parse to text
    if (name === 'title') {
      // Replace title in original text
      const newText: string = `${event.target.value}${text.slice(
        index,
        text.length
      )}`;
      setLocalStateState('text', newText);
    } else {
      // Replace text in original text
      const newText: string = `${text.slice(0, index + 1)}${
        event.target.value
      }`;
      setLocalStateState('text', newText);
    }
  };

  static getTileAndBody = (text: string) => {
    const result: any = {
      title: '',
      body: '',
    };

    const firstLineIndex: any = text ? text.indexOf('\n') : null;

    if (!firstLineIndex) {
      result.body = text;

      return result;
    }

    result.title = firstLineIndex !== -1 ? text.slice(0, firstLineIndex) : '';
    result.body = text.slice(
      firstLineIndex !== -1 ? firstLineIndex + 1 : 0,
      text.length
    );

    return result;
  };
}
