import { IconButton } from '@material-ui/core';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import React, { useContext, useState } from 'react';
import './TaskCheckButton.scss';
import { Context } from '../../../bloben-package/context/store';

interface ITaskCheckButtonViewProps {
  disabled?: boolean;
  isCompleted: boolean;
  handleCheck: any;
}
const TaskCheckButtonView = (props: ITaskCheckButtonViewProps) => {
  const { disabled, isCompleted, handleCheck } = props;

  const [store] = useContext(Context);
  const { isDark } = store;

  return (
    <div className={'task-check-button__container'}>
      <IconButton disabled={disabled} onClick={handleCheck}>
        {isCompleted ? (
          <CheckCircleIcon
            className={`task-check-button__icon${isDark ? '-dark' : ''} ${
              disabled ? 'disabled' : ''
            }`}
          />
        ) : (
          <RadioButtonUncheckedIcon
            className={`task-check-button__icon${isDark ? '-dark' : ''} ${
              disabled ? 'disabled' : ''
            }${isDark ? '-dark' : ''} `}
          />
        )}
      </IconButton>
    </div>
  );
};

interface ITaskCheckButtonProps {
  isCompleted: boolean;
  disabled?: boolean;
  checkTask: any;
}
const TaskCheckButton = (props: ITaskCheckButtonProps) => {
  const { isCompleted, disabled, checkTask } = props;

  return (
    <TaskCheckButtonView
      handleCheck={checkTask}
      isCompleted={isCompleted}
      disabled={disabled}
    />
  );
};

export default TaskCheckButton;
