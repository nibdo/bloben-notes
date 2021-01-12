import React, { useContext, useState } from 'react';
import './Task.scss';
import { Button } from '@material-ui/core';
import { format, isToday, isTomorrow } from 'date-fns';
import './taskCheckButton/TaskCheckButton.scss';
import TaskText from './taskText/TaskText';
import TaskCheckButton from './taskCheckButton/TaskCheckButton';
import { Context } from '../../bloben-package/context/store';

const formatReminderDate = (date: string): string => {
  const dateObj: Date = new Date(date);
  let dateString;
  if (isToday(dateObj)) {
    dateString = 'Today';
  } else if (isTomorrow(dateObj)) {
    dateString = 'Tomorow';
  } else {
    dateString = format(dateObj, 'd.M.yyyy');
  }
  const timeString: string = format(dateObj, 'HH:MM');
  const result: string = `${dateString} at ${timeString}`;

  return result;
};

const TaskReminder = (props: any) => {
  const { remindAt } = props;

  const [store] = useContext(Context);

  const { isDark } = store;

  return (
    <Button
      variant='outlined'
      size='small'
      className={`task__container-reminder${isDark ? '-dark' : ''}`}
    >
      <p className={`task__text-reminder${isDark ? '-dark' : ''}`}>
        {formatReminderDate(remindAt)}
      </p>
    </Button>
  );
};

interface ITaskViewProps {
  task: any;
  checkTask: any;
  onChange: any;
}
const TaskView = (props: ITaskViewProps) => {
  const [store] = useContext(Context);
  const { isDark } = store;

  const { task, checkTask, onChange } = props;

  const { id, text, isCompleted } = task;

  return (
    <div
      className={`task__container ${
        isDark ? 'dark_border_bottom' : 'light_border_bottom'
      } `}
    >
      <div className={'task__row'}>
        <TaskCheckButton isCompleted={isCompleted} checkTask={checkTask} />
        <TaskText text={text}  name={id} onChange={onChange}/>
      </div>
      {task.remindAt ? <TaskReminder remindAt={task.remindAt} /> : null}
    </div>
  );
};

interface ITaskProps {
  task: any;
  triggerSorting: any;
  checkTask: any;
  onChange: any;
  parentId?: string;
}
const Task = (props: ITaskProps) => {
  const { task, parentId, onChange, checkTask } = props;

  const handleTaskCheck = () => {
    checkTask(parentId, task.id);
  };

  return (
    <TaskView task={task} checkTask={handleTaskCheck} onChange={onChange} />
  );
};

export default Task;
