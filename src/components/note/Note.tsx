import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import './Note.scss';
import { format } from 'date-fns';
import EvaIcons from 'bloben-common/components/eva-icons';
import TagsText from '../tagsText/TagsText';
import { Context } from '../../bloben-package/context/store';
import { parseCssDark } from '../../bloben-common/utils/common';

interface INoteViewProps {
  note: any;
  handleNoteEdit: any;
  selectedId?: string;
  mappedTags: any;
}
const NoteView = (props: INoteViewProps) => {
  const [store] = useContext(Context);
  const {isDark, isMobile} = store;

  const {
    note,
    handleNoteEdit,
    selectedId,
    mappedTags,
  } = props;

  const { title, body, isPinned, updatedAt } = note;

  const date: string = format(new Date(updatedAt), 'dd. MM. yyyy');

  // Add color stripe in desktop view
  const stripedClassName: string =
    selectedId === note.id && !isMobile
      ? isDark
        ? 'stripe-left-dark'
        : 'stripe-left'
      : '';

  return (
    <div
      className={`note__container ${
        isDark ? 'dark_border_bottom' : 'light_border_bottom'
      } ${stripedClassName}`}
      onClick={handleNoteEdit}
    >
      <div className={'note__container-title'}>
        <p className={parseCssDark('note__text--title', isDark)}>
          {' '}
          {title && title.length > 0 ? title : '...'}
        </p>
        {isPinned ? (
          <div className={'note__pin-container'}>
            <EvaIcons.ArrowUp className={'svg-icon note__pin-icon'} />
          </div>
        ) : null}
      </div>
      <div className={'note__container--body'}>
        <p className={parseCssDark('note__text--body', isDark)}>{body[0].data}</p>
      </div>
      <div className={'note__footer'}>
        <TagsText mappedTags={mappedTags} note={note} />
      </div>
      <div className={'note__footer'}>
        <p className={'note__footer-date'}>{date}</p>
      </div>
    </div>
  );
};

interface INoteProps {
  note: any;
  selectedId?: string;
  mappedTags: any;
}
const Note = (props: INoteProps) => {
  const history = useHistory();

  const {
    note,
    selectedId,
    mappedTags,
  } = props;

  const handleNoteEdit = () => {
    history.push(`/notes/note/${note.id}`);
  };

  return (
    <NoteView
      selectedId={selectedId}
      note={note}
      handleNoteEdit={handleNoteEdit}
      mappedTags={mappedTags}
    />
  );
};

export default Note;
