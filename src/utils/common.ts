import _ from "lodash";
import { formatISO } from 'date-fns';
import { reduxStore } from 'bloben-package/layers/redux-layer';

export const STATUS_OK: string = 'ok';
export const STATUS_NOK: string = 'nok';

export const mapTags = (tags: any) => {
  const tagsObj: any = {};

  if (!tags || tags.length === 0) {
    return tagsObj;
  }

  for (const tag of tags) {
    const { id } = tag;
    // Check if is in tagsObj
    if (!tagsObj[id]) {
      tagsObj[id] = tag;
    }
  }

  return tagsObj;
};

export const cloneDeep = (obj: any): any => _.cloneDeep(obj);

export const getDataIds = (): any => {
  const store: any = reduxStore.getState();
  const stateCloneNotes: any = cloneDeep(store.notes);
  const stateCloneTags: any = cloneDeep(store.tags);

  const notes: any[] = stateCloneNotes.map((item: any) => {
    const {id, updatedAt} = item;

    return {id, updatedAt: formatISO(updatedAt)}
  })
  const tags: any[] = stateCloneTags.map((item: any) => {
    const {id, updatedAt} = item;

    return {id, updatedAt: formatISO(updatedAt)}
  })

  return {notes, tags}
}
