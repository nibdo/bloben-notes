import { logger } from 'bloben-common/utils/common';
import { LocalForage } from '../bloben-package/utils/LocalForage';
import OpenPgp from '../bloben-package/utils/OpenPgp';
import tagsLastSynced from './reducers/tagsLastSynced';

export const loadState =  async (state?: any) => {
  try {
    const isStorageEncrypted: boolean | null = await LocalForage.getItem('isStorageEncrypted');

    let decryptedState: any;

    if (!isStorageEncrypted) {
      decryptedState = await LocalForage.getItem('root');
    } else {
      decryptedState = JSON.parse(state);
    }

    if (decryptedState === null) {
      return undefined;
    }

    const parsedState: any = parseStringDateToDate(decryptedState);

    return parsedState;
  } catch (err) {
    logger(err);

    return undefined;
  }
};

export const saveState = async (root: any) => {
  try {
    const systemKeys: any = await LocalForage.getItem('systemKeys');

    if (systemKeys) {
      const { publicKey } = systemKeys;
      // Encrypt storage
      const encrypted: any = await OpenPgp.encrypt(publicKey, root);

      await LocalForage.setItem('root', encrypted)
    } else {
      await LocalForage.setItem('root', root);
    }
  } catch (err) {
    logger(err);
  }
};

const parseDatesGeneral = (item: any) => {
  item.createdAt = new Date(item.createdAt);
  item.updatedAt = new Date(item.updatedAt);
  item.deleletedAt = item.deleletedAt ? new Date(item.createdAt) : null;

  return item;
}

const parseStringDateToDate = (state: any) => {
  const result: any = {};

  const dateKeysSimple: any = ['notesLastSynced', 'tagsLastSynced']
  const dateKeysNested: any = ['notes', 'tags'];

  for (const [key, value] of Object.entries(state)) {
    const keyType: string = key;
    const valueAny: any = value;

    if (dateKeysSimple.indexOf(key) !== -1) {
      result[keyType] = new Date(valueAny);
    } else if (dateKeysNested.indexOf(key) !== -1) {
      const data: any = [];

      for (const item of valueAny) {
        data.push(parseDatesGeneral(item));
      }

      result[keyType] = data;
    } else {
      result[keyType] = valueAny;
    }
  }

  return result;
};
