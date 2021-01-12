export type EncryptedTaskType = {
  id: string;
  data: string;
  listId: string;
  isLocal: boolean;
  needSync: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  type: string;
};
export type EncryptedListType = {
  id: string;
  data: string;
  isShared: boolean;
  isLocal: boolean;
  needSync: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  type: string;
};

export type localListType = {
  id: string;
  type: string;
  data: string;
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
  needSync: boolean;
  isLocal: boolean;
  deleted: boolean;
};

export type localTaskType = {
  id: string;
  type: string;
  data: string;
  listId: string;
  createdAt: string;
  updatedAt: string;
  needSync: boolean;
  isLocal: boolean;
  deleted: boolean;
};

export type localSettingType = {
  key: string;
  value: string;
};

export type dummyDataType = {
  dummy: string;
};

// Data types
export type calendarColorType = {
  name: string;
  lightColor: string;
  darkColor: string;
};

export type calendarType = {
  id: string;
  type: string;
  name: string;
  color: calendarColorType;
  checked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type listType = any;

export type taskType = any;
export type encryptedTask = any;
export type DecryptedTaskType = {
  text: string;
  type: string;
  isCompleted: boolean;
  isFavourite: boolean;
  remindAt: Date | null;
};
export type DecryptedListType = {
  name: string;
  isShared: boolean;
  sortBy: string;
  type: string;
  sharedPassword: string | undefined | null;
};

export type GetNoteWebsocketDTO = {
  id: string;
}

export type NoteResultDTO = {
  id: string;
  data: string;
  tags: any;
  createdAt: string;
  updatedAt: string;
}
export type TagResultDTO = {
  id: string;
  data: string;
  createdAt: string;
  updatedAt: string;
}

