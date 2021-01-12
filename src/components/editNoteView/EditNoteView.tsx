import React, { useContext, useState } from 'react';
import './EditNoteView.scss';
import IconButton from '@material-ui/core/IconButton';
import TagsList from '../tagsList/TagsList';
import BottomSheet from 'bottom-sheet-react';
import EvaIcons from 'bloben-common/components/eva-icons';
import ItemHeader from '../../bloben-package/components/item-header/item-header';
import { useSelector } from 'react-redux';
import NoteControls from '../noteControls/NoteControls';
import Task from '../task/Task';
import TaskCheckButton from '../task/taskCheckButton/TaskCheckButton';
import TaskText from '../task/taskText/TaskText';
import { hookHeight } from 'bottom-sheet-react/utils';
import HeaderModal from '../../bloben-package/components/headerModal/HeaderModal';
import Dropdown from '../../bloben-package/components/dropdown/Dropdown';
import { Input } from '../../bloben-package/components/input/Input';
import { Context } from '../../bloben-package/context/store';

interface ITasksListProps {
  data: any;
  setState: any;
  triggerSorting: any;
  checkTask: any;
  parentId?: string;
}
const TasksList = (props: ITasksListProps) => {
  const { data, setState, triggerSorting, checkTask, parentId } = props;

  return data.map((item: any) => (
    <Task
      key={item.id}
      task={item}
      triggerSorting={triggerSorting}
      checkTask={checkTask}
      parentId={parentId}
     onChange={}/>
  ));
};

const NewTaskInput = (props: any) => {
  const { parentId, addNewTask } = props;
  const isDark: boolean = useSelector((state: any) => state.isDark);

  const [text, setText] = useState('');

  const onChange = (e: any) => {
    if (e.key !== 'Enter') {
      setText(e.target.value);
    }
  };

  const handleAddTask = () => {
    addNewTask(parentId, text);
    setText('');
  };

  return (
    <div
      className={`task__container ${
        isDark ? 'dark_border_bottom' : 'light_border_bottom'
      }`}
    >
      <div className={'task__row'}>
        <TaskCheckButton
          checkTask={() => {}}
          isCompleted={false}
          disabled={true}
        />
        <TaskText
          placeholder={'Add new task'}
          text={text}
          submitOnEnter={handleAddTask}
          onChange={onChange}
          name={''}
        />
      </div>
    </div>
  );
};

interface IEditNoteViewProps {
  isNewNote: boolean;
  note: any;
  onChange: any;
  title: string;
  body: any;
  createTaskNote: any;
  checkTask: any;
  handleBlur: any;
  handleDelete: any;
  handleTagsOpen: any;
  tagsListIsOpen: boolean;
  tags: any;
  handleTagsClose: any;
  selectTag: any;
  selectedTags: any;
  mappedTags: any;
  addNewTask: any;
}
const EditNoteView = (props: IEditNoteViewProps) => {
  const {
    isNewNote,
    note,
    onChange,
    title,
    body,
    createTaskNote,
    checkTask,
    handleBlur,
    handleDelete,
    handleTagsOpen,
    tagsListIsOpen,
    tags,
    handleTagsClose,
    selectTag,
    selectedTags,
    mappedTags,
    addNewTask,
  } = props;

  const [hasHeaderShadow, setHeaderShadow] = useState(false);
  const height: any = hookHeight();
  const [store] = useContext(Context);
  const {isDark, isMobile} = store;

  const renderBody = () => {
    if (!body || body.length === 0) {
      return null;
    }

    return body.map((item: any) => {
      if (item.type === 'tasks') {
        return (
          <div className={'tasks-container'}>
            {item.data && item.data.length > 0 ? (
              <TasksList
                data={item.data}
                checkTask={checkTask}
                parentId={item.id}
                setState={}
               triggerSorting={}/>
            ) : null}
            <NewTaskInput addNewTask={addNewTask} parentId={item.id} />
          </div>
        );
      } else {
        return (
          <Input
            key={item.id}
            className={`edit-note__input${isDark ? '-dark' : ''}`}
            name={item.id}
            value={item.data}
            autoFocus={isNewNote}
            placeholder={'Start writing your note'}
            onChange={onChange}
            // onFocus={onFocusOn}
            // onBlur={onFocusOff}
            multiline={true}
          />
        );
      }
    });
  };

  const inputs: any = renderBody();

  const handleScroll = (e: any) => {
    if (e.target.scrollTop > 0) {
      setHeaderShadow(true);
    } else {
      setHeaderShadow(false);
    }
  };

  // Set height for input
  const inputStyle: any = {
    height: isMobile ? height - 60 : height - 120,
  };

  return (
    <div className={'edit-note__wrapper'}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
        {!isMobile && note ? (
          <ItemHeader item={note} mappedTags={mappedTags} />
        ) : null}
        <HeaderModal
          onClose={handleBlur}
          handleDelete={!isNewNote ? handleDelete : null}
          handleSave={handleBlur}
          hasHeaderShadow={hasHeaderShadow}
          // title={hasHeaderShadow ? title : null}
          icons={[
            // <IconButton
            //   key={0}
            //   onClick={handleShareModal}
            //   style={{ position: 'relative' }}
            // >
            //   <EvaIcons.PersonAddIcon
            //     className={`icon-svg${isDark ? '-dark' : ''}`}
            //   />
            // </IconButton>,
            <IconButton
              key={1}
              onClick={handleTagsOpen}
              style={{ position: 'relative' }}
            >
              <EvaIcons.Tag className={`icon-svg${isDark ? '-dark' : ''}`} />
              {!isMobile ? (
                <Dropdown
                  type={'checkbox'}
                  values={tags}
                  selectedValue={selectedTags}
                  onClick={selectTag}
                  isOpen={tagsListIsOpen}
                  handleClose={handleTagsClose}
                >
                  <TagsList
                    tags={tags}
                    selectedTags={selectedTags}
                    selectTag={selectTag}
                  />
                </Dropdown>
              ) : null}
            </IconButton>,
          ]}
        />
      </div>

      <div
        className={'edit-note__container'}
        onScroll={handleScroll}
        style={inputStyle}
      >
        {isMobile ? <ItemHeader item={note} mappedTags={mappedTags} /> : null}

        <Input
          className={`edit-note__input-title${isDark ? '-dark' : ''} `}
          name={'title'}
          value={title}
          placeholder={'Title'}
          autoComplete={false}
          onChange={onChange}
          // onBlur={handleBlur}
          multiline={false}
        />
        {inputs}
      </div>
      {tagsListIsOpen && isMobile ? (
        <BottomSheet
          backdropClassName={isDark ? 'bottom-sheet__backdrop--dark' : ''}
          containerClassName={isDark ? 'bottom-sheet__container--dark' : ''}
          isExpandable={true}
          onClose={handleTagsClose}
        >
          <TagsList
            tags={tags}
            selectedTags={selectedTags}
            selectTag={selectTag}
          />
        </BottomSheet>
      ) : null}
      <NoteControls createTaskNote={createTaskNote}  handleBold={} handleNormalText={}/>
    </div>
  );
};

export default EditNoteView;
