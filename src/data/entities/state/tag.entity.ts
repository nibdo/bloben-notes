import { v4 } from 'uuid';
import { parseDateToString, parseToDate } from '../../../bloben-package/utils/common';
import OpenPgp from '../../../bloben-package/utils/OpenPgp';

export type TagsStateType = 'tags';
export const TAGS_STATE: string = 'tags';

/**
 * Private part for encryption
 */
export type TagPropsForEncryption = {
  name: string;
};
/**
 * Body to save in server
 */
export type TagBodyToSend = {
  id: string;
  data: string;
  createdAt: string;
  updatedAt: string;
}

export type TagStateType = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isLocal: boolean;
  isSynced: boolean;
};

export default class TagStateEntity {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  isLocal: boolean;
  isSynced: boolean;

  constructor(data: any) {
    const isNotNew: boolean = data.updatedAt;

    this.id = data.id ? data.id : v4();
    this.name = data.name;
    this.createdAt = data.createdAt ? parseToDate(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? parseToDate(data.updatedAt) : this.createdAt;
    this.isLocal = !isNotNew;
    this.isSynced = isNotNew;
  }

  public createFromEncrypted = (encryptedData: any, decryptedData: any) => {
    this.id = encryptedData.id
    this.name = decryptedData.name;
    this.createdAt = parseToDate(encryptedData.createdAt);
    this.updatedAt = parseToDate(encryptedData.updatedAt);
    this.isLocal = false;
    this.isSynced = true;
  }
  public getStoreObj = (): any => {
    return {
      id: this.id,
      name: this.name,
      createdAt: parseToDate(this.createdAt),
      updatedAt: parseToDate(this.updatedAt),
      isLocal: false,
      isSynced: true,
    }
  }
  /**
   * Get only private parts of tag for encryption
   */
  public getTagPropsForEncryption = (): TagPropsForEncryption =>
      ({
        name: this.name,
      })

  public formatBodyToSendPgp = async (publicKey: string): Promise<TagBodyToSend> =>
      (
          {
            id: this.id,
            data: await OpenPgp.encrypt(publicKey, this.getTagPropsForEncryption()),
            createdAt: parseDateToString(this.createdAt),
            updatedAt: parseDateToString(this.updatedAt),
          }
      )
  public static flagAsSynced = (tag: TagStateEntity): TagStateEntity => {
    tag.isSynced = true;
    tag.isLocal = false;

    return tag;
  }
}
