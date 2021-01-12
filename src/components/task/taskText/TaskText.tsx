import React, { useContext } from 'react';
import './TaskText.scss';
import { InputBase } from '@material-ui/core';
import { Context } from '../../../bloben-package/context/store';

interface ITaskTextProps {
    text: string;
    name: string;
    placeholder?: string;
    submitOnEnter?: any;
    onChange: any;
}
const TaskText = (props: ITaskTextProps) => {
    const [store] = useContext(Context);
    const {isDark} = store;

    const { text, name, placeholder, submitOnEnter, onChange } = props;

    const handleKeyPress = (ev: any) => {
            if (submitOnEnter) {
                if (ev.key === 'Enter') {
                    submitOnEnter(ev);
                    ev.preventDefault();
                }
        }
    };

    return (
      <InputBase className={`task-text__text ${isDark ? 'dark_text' : 'light_text'}`}
                 value={text}
                 name={name}
                 placeholder={placeholder}
                 multiline={true}
                 onChange={onChange}
                 onKeyDown={handleKeyPress}
      />
  );
};

export default TaskText;
