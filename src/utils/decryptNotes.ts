import { mergeNotes } from './mergeNotes';
import OpenPgp, { PgpKeys } from '../bloben-package/utils/OpenPgp';
import { NoteResultDTO } from '../types/types';
import NoteStateEntity from '../data/entities/state/note.entity';
import { reduxStore } from '../bloben-package/layers/ReduxLayer';
import { cloneDeep } from './common';
import { logger } from '../bloben-common/utils/common';
import { findInArrayById } from '../bloben-package/utils/common';
import { setNotes, setNotesLastSync } from '../redux/actions';

const decryptNote = async (
  password: string,
  pgpKeys: PgpKeys,
  item: NoteResultDTO
): Promise<NoteStateEntity> => {
  const noteResultDTO: NoteResultDTO = item;

  // First parse tags
  // noteResultDTO.tags = JSON.parse(noteResultDTO.tags)

  let decryptedData: any = await OpenPgp.decrypt(
    pgpKeys.publicKey,
    pgpKeys.privateKey,
    password,
    noteResultDTO.data
  );
  decryptedData = JSON.parse(decryptedData);

  // decryptedData.tags = tags;

  const finalForm: any = {
    ...noteResultDTO,
    ...decryptedData,
  };
  const newNote: NoteStateEntity = new NoteStateEntity(finalForm);

  return newNote.getReduxStateObj();
};

export const decryptNotes = async (data: any): Promise<void> => {
  const store: any = reduxStore.getState();
  const password: string = store.password;
  const pgpKeys: PgpKeys = store.pgpKeys;

  let allNotesClone: any = cloneDeep(store.notes);

  // Handle new, updated and deleted notes
  if (store.notesLastSynced) {
    logger("data notesLastSynced", data);

    for (let j = 0; j < data.length; j += 1) {
      let newItem: any;

      const noteInState: any = await findInArrayById(allNotesClone, data[j].id);


      if (!data[j].deletedAt) {
        newItem = await decryptNote(password, pgpKeys, data[j]);
      }

      // Filter deleted notes
      if (data[j].deletedAt) {
        allNotesClone = allNotesClone.filter(
          (note: any) => note.id !== data[j].id
        );
      } else {
        // Redux store is empty, just push it
        if (allNotesClone.length === 0) {
          allNotesClone.push(newItem);
        } else {
          // Note is either new or needs update
          if (noteInState) {
            const resultAllNotesClone: any = [];

            for (const [index, note] of allNotesClone.entries()) {
              if (note.id === newItem.id) {

                // Apply merging rules
                newItem.body = await mergeNotes(note.body, newItem.body);

                resultAllNotesClone.push(newItem);
              } else {
                resultAllNotesClone.push(note)
              }

              if (index + 1 === allNotesClone.length) {
                allNotesClone = resultAllNotesClone;
              }
            }
            // allNotesClone = allNotesClone.map(async (note: any, index: number) => {
            //
            // });

          } else {
            // Note not found, push it
            allNotesClone.push(newItem);
          }
        }
      }

      if (j + 1 === data.length) {
        reduxStore.dispatch(setNotes(allNotesClone));
      }
    }
  } else {
    const result: any = [];

    if (data && data.length > 0) {
      for (const item of data) {
        if (!item.deletedAt) {
          const noteResultDTO: NoteResultDTO = item;
          const simpleEventObj: NoteStateEntity = await decryptNote(
            password,
            pgpKeys,
            noteResultDTO
          );

          result.push(simpleEventObj);
        }
      }
    }
    reduxStore.dispatch(setNotes(result));
  }
  reduxStore.dispatch(setNotesLastSync(new Date()));
};
