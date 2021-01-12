import React, { useContext } from 'react';
import './NoteText.scss';
import { Context } from '../../../bloben-package/context/store';

interface INoteTextViewProps {
  text: string;
}
const NoteTextView = (props: INoteTextViewProps) => {
  const [store] = useContext(Context);
  const { isDark } = store;

  const { text } = props;

  return (
    <p className={`note-text__text ${isDark ? 'dark_text' : 'light_text'}`}>
      {text}
    </p>
  );
};

interface INoteTextProps {
  text: string;
}
const NoteText = (props: INoteTextProps) => {
  const { text } = props;

  return <NoteTextView text={text} />;
};

export default NoteText;
