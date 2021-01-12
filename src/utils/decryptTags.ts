import { reduxStore } from 'bloben-package/layers/redux-layer';
import { cloneDeep } from './common';
import { logger } from '../bloben-common/utils/common';
import { findInArrayById } from '../bloben-package/utils/common';
import OpenPgp, { PgpKeys } from '../bloben-package/utils/OpenPgp';
import { setNotes, setNotesLastSync, setTags, setTagsLastSynced } from '../redux/actions';
import TagStateEntity from '../data/entities/state/tag.entity';
import { NoteResultDTO, TagResultDTO } from '../types/types';
import NoteStateEntity from '../data/entities/state/note.entity';

const decryptTag = async (
    password: string,
    pgpKeys: PgpKeys,
    item: any
): Promise<TagStateEntity> => {
    const tagResultDTO: any = item;
    let decryptedData: any = await OpenPgp.decrypt(
        pgpKeys.publicKey,
        pgpKeys.privateKey,
        password,
        tagResultDTO.data
    );
    decryptedData = JSON.parse(decryptedData);

    const finalForm: any = {
        ...tagResultDTO,
        ...decryptedData,
    };
    const tag: TagStateEntity = new TagStateEntity(finalForm);

    return tag.getStoreObj();
};

export const decryptTags = async (data: any): Promise<void> => {
    const store: any = reduxStore.getState();
    const password: string = store.password;
    const pgpKeys: PgpKeys = store.pgpKeys;

    let allStateClone: any = cloneDeep(store.tags);

// Handle new, updated and deleted notes
    if (store.tagsLastSynced) {
        logger("tags tagsLastSynced", data);

        for (let j = 0; j < data.length; j += 1) {
            let newItem: any;

            const itemInState: any = await findInArrayById(allStateClone, data[j].id);


            if (!data[j].deletedAt) {
                newItem = await decryptTag(password, pgpKeys, data[j]);
            }

            // Filter deleted notes
            if (data[j].deletedAt) {
                allStateClone = allStateClone.filter(
                    (tag: any) => tag.id !== data[j].id
                );
            } else {
                // Redux store is empty, just push it
                if (allStateClone.length === 0) {
                    allStateClone.push(newItem);
                } else {
                    // Note is either new or needs update
                    if (itemInState) {
                        allStateClone = allStateClone.map((tag: any, index: number) => {
                            if (tag.id === newItem.id) {
                                return newItem;
                            } else {
                                return tag
                            }
                        });

                    } else {
                        // Note not found, push it
                        allStateClone.push(newItem);
                    }
                }
            }

            if (j + 1 === data.length) {
                reduxStore.dispatch(setTags(allStateClone));
            }
        }
    } else {
        const result: any = [];

        if (data && data.length > 0) {
            for (const item of data) {
                if (!item.deletedAt) {
                    const tagResultDTO: TagResultDTO = item;
                    const simpleObj: TagStateEntity = await decryptTag(
                        password,
                        pgpKeys,
                        tagResultDTO
                    );

                    result.push(simpleObj);
                }
            }
        }
        reduxStore.dispatch(setTags(result));
    }
    reduxStore.dispatch(setTagsLastSynced(new Date()));
};
