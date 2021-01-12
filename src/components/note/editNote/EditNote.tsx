import React, { useEffect, useReducer, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import StateReducer from '../../../bloben-package/utils/state-reducer';
import '../../editNoteView/EditNoteView.scss';
import Utils from './EditNote.utils';

import { STATUS_OK } from '../../../utils/common';

import NoteStateEntity, {
  NoteBodyToSend,
} from '../../../data/entities/state/note.entity';
import NotesApi, {
  sendWebsocketMessage,
  WEBSOCKET_CREATE_NOTE,
  WEBSOCKET_DELETE_NOTE,
  WEBSOCKET_UPDATE_NOTE,
} from '../../../api/notes';
import EditNoteView from '../../editNoteView/EditNoteView';
import { useDispatch, useSelector } from 'react-redux';
import { PgpKeys } from '../../../bloben-package/utils/OpenPgp';
import { addNote, softDeleteNote, updateNote } from '../../../redux/actions';
import { v4 } from 'uuid';
import { findIndexById } from '../../../bloben-package/utils/common';
import Filter from '../../../utils/filterData';

const createTaskInput = (username: string) => ({
  id: v4(),
  type: 'tasks',
  data: [],
  author: username,
  updatedAt: new Date(),
  order: 5,
});

interface IEditNoteProps {
  setState: any;
  notes: any;
  goBack?: any;
  triggerSorting: any;
  tags: any;
  mappedTags: any;
  isNewNote: boolean;
}
const EditNote = (props: IEditNoteProps) => {
  const params: any = useParams();
  const history = useHistory();

  const [editNoteState, dispatchState]: any = useReducer(
    StateReducer,
    Utils.initialState
  );

  const {
    setState,
    notes,
    goBack,
    triggerSorting,
    tags,
    mappedTags,
    isNewNote,
  } = props;

  const { noteId } = params;
  const username: string = useSelector((state: any) => state.username);
  const pgpKeys: PgpKeys = useSelector((state: any) => state.pgpKeys);

  const {
    isFocused,
    title,
    note,
    tagsListIsOpen,
    selectedTags,
    textWasChanged,
    shareModalIsVisible,
    notePassword,
    body,
  } = editNoteState;

  const dispatch: any = useDispatch();

  const stateRef: any = React.useRef(editNoteState);
  // // Save values in ref for each change
  // useEffect(() => {
  //   stateRef.current.title = title;
  //   stateRef.current.text = text;
  //   stateRef.current.selectedTags = selectedTags;
  //   stateRef.current.note = note;
  // },        [note.id, text, title, selectedTags]);
  //
  // const AUTOSAVE_INTERVAL = 3000;
  // React.useEffect(() => {
  //   const timer = setTimeout(async () => {
  //
  //     if (lastText !== text || lastTitle !== title) {
  //       setLocalStateState('lastText', text);
  //       setLocalStateState('lastTitle', title);
  //       console.log('saving');
  //       await handleSave();
  //     }
  //   },                       AUTOSAVE_INTERVAL);
  //
  //   return () => clearTimeout(timer);
  // },              [text, title]);

  const resetState = () => {
    setLocalStateState('selectedTags', []);
    setLocalStateState('note', null);
    setLocalStateState('title', '');
    setLocalStateState('body', []);
    setLocalStateState('lastTitle', '');
    setLocalStateState('noteWasUpdated', false);
    stateRef.current.title = '';
    stateRef.current.body = [];
    stateRef.current.selectedTags = [];
    stateRef.current.note = null;
  };

  useEffect(() => {
    if (isNewNote) {
      resetState();
      createTextNote();

      return;
    }
    // Find task
    // TODO: Add loading
    const thisNote = Filter.findById(noteId, notes);

    if (!thisNote) {
      return;
    }
    setLocalStateState('selectedTags', thisNote.tags);
    setLocalStateState('note', thisNote);
    setLocalStateState('title', thisNote.title);
    setLocalStateState('body', thisNote.body);
    setLocalStateState('lastTitle', thisNote.title);
    setLocalStateState('noteWasUpdated', false);
    stateRef.current.title = thisNote.title;
    stateRef.current.body = thisNote.body;
    stateRef.current.selectedTags = thisNote.selectedTags;
    stateRef.current.note = thisNote;
    // handleSave(title, text, selectedTags, note);
  }, [noteId]);

  useEffect(() => {
    if (isNewNote) {
      resetState();
      createTextNote();

      return;
    }
    // Find task
    // TODO: Add loading
    const thisNote = Filter.findById(noteId, notes);

    setLocalStateState('selectedTags', thisNote.tags);
    setLocalStateState('note', thisNote);
    setLocalStateState('title', thisNote.title);
    setLocalStateState('body', thisNote.body);
    setLocalStateState('lastBody', thisNote.body);
    setLocalStateState('lastTitle', thisNote.title);
    setLocalStateState('text', thisNote.text);
    setLocalStateState('lastText', thisNote.text);
  }, []);

  useEffect(
    () => () => {
      resetState();
    },
    []
  );

  const setLocalStateState = (stateName: string, data: any): void => {
    const payload: any = { stateName, type: 'simple', data };
    // @ts-ignore
    dispatchState({ state, payload });
  };

  const saveNote = async (
    noteTitle: string = title,
    noteTags: any = selectedTags,
    noteObj: NoteStateEntity = note
  ) => {
    if (isNewNote) {
      if (body[0].data === '' && title === '') {
        return;
      }
      const newNote: NoteStateEntity = new NoteStateEntity({
        title,
        body,
        tags: selectedTags,
      });
      // Encrypt data
      const bodyToSend: NoteBodyToSend = await newNote.formatBodyToSendOpenPgp(
        pgpKeys
      );

      // Get only simple object
      const simpleObj: NoteStateEntity = newNote.getReduxStateObj();

      // Save to redux store
      dispatch(addNote(simpleObj));

      sendWebsocketMessage(WEBSOCKET_CREATE_NOTE, bodyToSend);
    } else {
      noteObj.title = title;
      noteObj.tags = selectedTags;
      noteObj.body = body;
      // TODO
      // if (!textWasChanged || (!textWasChanged && !tagsWereChanged)) {
      //   return;
      // }

      const noteToEdit: NoteStateEntity = new NoteStateEntity(noteObj);

      // Encrypt data
      const bodyToSend: NoteBodyToSend = await noteToEdit.formatBodyToSendOpenPgp(
        pgpKeys
      );

      // Different handling for new event and edited event
      // Get only simple object
      const simpleObj: NoteStateEntity = noteToEdit.getReduxStateObj();

      // Save to redux store
      dispatch(updateNote(simpleObj));

      sendWebsocketMessage(WEBSOCKET_UPDATE_NOTE, bodyToSend);

      setLocalStateState('textWasChanged', false);

      // goBack();
    }

    triggerSorting();
  };

  const handleSaveTags = async (newStateTags: any): Promise<void> => {
    // TODO save text if was changed
    const data: any = { id: note.id, tags: newStateTags };

    const noteUpdated: any = { ...note };
    noteUpdated.tags = newStateTags;

    const dataObj: any = {
      tags: newStateTags,
    };

    if (textWasChanged) {
      // const stateData: any = new NoteStateEntity({ title, text });
      // const encryptedData = await Crypto.encrypt(stateData, '');
      // dataObj.data = encryptedData;
      // noteUpdated.title = title;
      // noteUpdated.text = text;
    }

    const res = await NotesApi.addTags(data);

    if (res.status === STATUS_OK) {
      // Data saved on server, update local obj
      setLocalStateState('noteWasUpdated', true);
    } else {
      // TODO: handle error
    }
  };

  const selectTag = async (tag: any) => {
    // Check if tag is selected
    let newStateTags: any;
    // tslint:disable-next-line:prefer-conditional-expression
    if (selectedTags.indexOf(tag) !== -1) {
      newStateTags = [...selectedTags].filter((item: any) => item !== tag);
    } else {
      newStateTags = [...selectedTags, tag];
    }
    setLocalStateState('tagsWereChanged', true);
    setLocalStateState('selectedTags', newStateTags);
    // await handleSaveTags(newStateTags);
  };

  const handlePin = async () => {
    note.isPinned = !note.isPinned;
    triggerSorting();
  };

  const saveTaskAndClose = async () => {
    triggerSorting();
    resetState();

    if (goBack) {
      goBack();
    }
  };

  const handleBlur = async () => {
    await saveNote();

    resetState();
    history.goBack();
  };

  const handleBack = async () => {
    await handleBlur();
  };

  const handleDelete = async () => {
    sendWebsocketMessage(WEBSOCKET_DELETE_NOTE, { id: note.id });
    // Save to redux store
    dispatch(softDeleteNote(note));
    history.goBack();
  };

  const handleKeyDown = async (e: any) => {
    const key = e.key;
    switch (key) {
      default:
        return;
      case 'Enter':
        await handleBlur();
        e.preventDefault();
        break;
      case 'Escape':
        goBack();
    }
  };

  const handleTagsOpen = () => {
    setLocalStateState('tagsListIsOpen', true);
  };

  const handleTagsClose = () => {
    setLocalStateState('tagsListIsOpen', false);
  };
  const onFocusOn = () => {
    setLocalStateState('isFocused', true);
  };

  const onFocusOff = () => {
    setLocalStateState('isFocused', false);
  };

  const handleShareModal = (value: boolean = true) => {
    setLocalStateState('shareModalIsVisible', value);
  };

  // TODO add index from within item input
  const onChange = (event: any) => {
    const target = event.target;
    const name: string = target.name;
    if (name === 'title') {
      setLocalStateState(target.name, event.target.value);
    } else {
      let bodyClone: any = [...body];

      bodyClone = bodyClone.map((item: any) => {
        if (item.id === target.name) {
          item.data = event.target.value;

          return item;
        } else {
          return item;
        }
      });

      setLocalStateState('body', bodyClone);

      setLocalStateState('textWasChanged', true);
    }
  };

  const createTaskNote = () => {
    // TODO Get item in focus and create tasks after

    // Create new task input
    const taskInput: any = createTaskInput(username);

    // Add task input to body
    setLocalStateState('body', [...body, taskInput]);
  };

  const createTextNote = () => {
    const textNote: any = {
      id: v4(),
      data: '',
      author: username,
      updatedAt: new Date(),
      order: 1,
      type: 'text',
    };

    setLocalStateState('body', [...body, textNote]);
  };

  /**
   * TASK NOTES
   */
  const addNewTask = async (id: string, taskText: string) => {
    const taskItem: any = {
      id: v4(),
      text: taskText,
      isCompleted: false,
    };
    // Add task item to parent in body
    const bodyCopy: any = [...body];

    // Find body item with id
    const itemIndex: any = await findIndexById(bodyCopy, id);

    if (!itemIndex) {
      return;
    }

    const itemCopy: any = { ...bodyCopy[itemIndex] };
    itemCopy.data.push(taskItem);

    bodyCopy[itemIndex] = itemCopy;

    setLocalStateState('body', bodyCopy);
  };

  const checkTask = async (parentId: string, taskId: string) => {
    const bodyCopy: any = [...body];

    // Find body item with id
    const itemIndex: any = await findIndexById(bodyCopy, parentId);

    if (!itemIndex) {
      return;
    }

    const itemCopy: any = { ...bodyCopy[itemIndex] };

    // Find specific task
    const taskItemIndex: any = await findIndexById(itemCopy.data, taskId);

    const taskItemCopy: any = { ...bodyCopy[itemIndex].data[taskItemIndex] };

    taskItemCopy.isCompleted = !taskItemCopy.isCompleted;

    bodyCopy[itemIndex].data[taskItemIndex] = taskItemCopy;

    setLocalStateState('body', bodyCopy);
  };
  /**
   * TASK NOTES END
   */

  return (
    <EditNoteView
      isNewNote={isNewNote}
      onChange={onChange}
      title={title}
      body={body}
      saveTask={saveTaskAndClose}
      handleBlur={handleBlur}
      handleKeyDown={handleKeyDown}
      noteId={noteId}
      setState={setState}
      note={note}
      goBack={handleBack}
      handleDelete={handleDelete}
      handlePin={handlePin}
      tags={tags}
      handleTagsOpen={handleTagsOpen}
      tagsListIsOpen={tagsListIsOpen}
      handleSaveTags={handleSaveTags}
      selectTag={selectTag}
      selectedTags={selectedTags}
      handleTagsClose={handleTagsClose}
      onFocusOn={onFocusOn}
      onFocusOff={onFocusOff}
      isFocused={isFocused}
      mappedTags={mappedTags}
      handleShareModal={handleShareModal}
      shareModalIsVisible={shareModalIsVisible}
      passwordValue={notePassword}
      createTaskNote={createTaskNote}
      addNewTask={addNewTask}
      checkTask={checkTask}
    />
  );
};

export default EditNote;
