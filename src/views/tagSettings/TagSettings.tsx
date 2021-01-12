import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import './TagSettings.scss';
import { useDispatch, useSelector } from 'react-redux';
import TagStateEntity, {
  TagBodyToSend,
} from '../../data/entities/state/tag.entity';
import {
  addTag,
  selectTag,
  setNotes,
  setSortedNotes,
  softDeleteNote,
  updateTag,
} from '../../redux/actions';
import {
  sendWebsocketMessage,
  WEBSOCKET_CREATE_TAG,
  WEBSOCKET_DELETE_TAG,
  WEBSOCKET_UPDATE_TAG,
} from '../../api/notes';
import { PgpKeys } from '../../bloben-package/utils/OpenPgp';
import IconButton from '@material-ui/core/IconButton';
import EvaIcons from 'bloben-common/components/eva-icons';
import { cloneDeep } from '../../utils/common';
import NoteStateEntity from '../../data/entities/state/note.entity';
import { Input } from '../../bloben-package/components/input/Input';
import { Context } from '../../bloben-package/context/store';
import HeaderModal from '../../bloben-package/components/headerModal/HeaderModal';

interface ITagInputProps {
  tag: any;
}
const TagInput = (props: ITagInputProps) => {
  const { tag } = props;
  const [value, setValue] = useState('');
  const isDark: boolean = useSelector((state: any) => state.isDark);
  const pgpKeys: PgpKeys = useSelector((state: any) => state.pgpKeys);
  const selectedTag: any = useSelector((state: any) => state.selectedTag);
  const notes: any = useSelector((state: any) => state.notes);

  const dispatch: any = useDispatch();

  const saveTag = async () => {
    // No change
    if (value === tag.name) {
      return;
    }

    const newTag: TagStateEntity = new TagStateEntity(tag);
    newTag.name = value;

    // Encrypt data
    const bodyToSend: TagBodyToSend = await newTag.formatBodyToSendPgp(
      pgpKeys.publicKey
    );

    // Get only simple object
    const simpleObj: TagStateEntity = newTag.getStoreObj();

    // Save to redux store
    dispatch(updateTag(simpleObj));

    sendWebsocketMessage(WEBSOCKET_UPDATE_TAG, bodyToSend);
  };

  const handleDelete = async (e: any) => {
    if (selectedTag.id === tag.id) {
      dispatch(selectTag({ id: null, name: 'All notes' }));
    }
    sendWebsocketMessage(WEBSOCKET_DELETE_TAG, { id: tag.id });
    // Save to redux store
    dispatch(softDeleteNote(tag));

    // Need to clear all local notes of that tag
    let notesCopy: any = cloneDeep(notes);
    notesCopy = notesCopy.map((note: any) => {
      note.tags = note.tags.filter((tagId: string) => tagId !== tag.id);

      return note;
    });

    dispatch(setNotes(notesCopy));

    const tagNotes: any = NoteStateEntity.getNotes(
      selectedTag.id && selectedTag.id !== tag.id ? selectedTag.id : null,
      notes
    );
    if (tagNotes.length === 0) {
      dispatch(setSortedNotes([]));

      return;
    }
    const sortedNotesResult: any = await NoteStateEntity.getOrder(tagNotes);

    dispatch(setSortedNotes(sortedNotesResult));
  };

  useEffect(() => {
    setValue(tag.name);
  }, []);

  const onChange = (e: any) => {
    setValue(e.target.value);
  };

  return (
    <div className={'tag-settings__row'}>
      <Input
        className={`edit-task__input${isDark ? '-dark' : ''}`}
        placeholder={'Type tag name'}
        autoFocus={false}
        name={'name'}
        value={value}
        onChange={onChange}
        multiline={false}
        handleBlur={saveTag}
      />
      <IconButton
        size="small"
        style={{ padding: 0, paddingLeft: 8, paddingRight: 8 }}
        onClick={handleDelete}
      >
        <EvaIcons.Trash className={'icon-svg'} />
      </IconButton>
    </div>
  );
};

const NewTagInput = () => {
  const [store] = useContext(Context);
  const { isDark } = store;

  const pgpKeys: PgpKeys = useSelector((state: any) => state.pgpKeys);

  const [value, setValue] = useState('');

  const dispatch: any = useDispatch();

  const onChange = (e: any) => {
    setValue(e.target.value);
  };

  const saveTag = async () => {
    // Different handling for new event and edited event
    const newTag: TagStateEntity = new TagStateEntity({
      name: value,
    });
    // Encrypt data
    const bodyToSend: TagBodyToSend = await newTag.formatBodyToSendPgp(
      pgpKeys.publicKey
    );

    // Get only simple object
    const simpleObj: TagStateEntity = newTag.getStoreObj();

    // Save to redux store
    dispatch(addTag(simpleObj));

    sendWebsocketMessage(WEBSOCKET_CREATE_TAG, bodyToSend);
    setValue('');
  };

  const submitOnEnter = async (e: any) => {
    await saveTag();
    e.preventDefault();
  };

  return (
    <Input
      className={`edit-task__input${isDark ? '-dark' : ''}`}
      placeholder={'Type tag name'}
      autoFocus={false}
      name={'name'}
      value={value}
      onChange={onChange}
      multiline={false}
      submitEnter={submitOnEnter}
    />
  );
};

const TagSettingsView = () => {
  const [store] = useContext(Context);
  const { isDark } = store;

  const tags: any = useSelector((state: any) => state.tags);

  const renderTagInputs = () => {
    if (!tags || tags.length === 0) {
      return null;
    }

    return tags.map((tag: any) => {
      if (!tag.deletedAt) {
        return <TagInput tag={tag} />;
      }
    });
  };

  const tagInputs: any = renderTagInputs();

  return (
    <div className={'tag-settings__wrapper'}>
      <HeaderModal hasHeaderShadow={true} title={'Tag settings'} />
      <div className={`tag-settings__container${isDark ? '-dark' : ''}`}>
        <NewTagInput />
        {tags.length > 0 ? tagInputs : null}
      </div>
    </div>
  );
};

const TagSettings = () => <TagSettingsView />;

export default TagSettings;
