import React from 'react';
import './NoteControls.scss';
import FormatBoldRoundedIcon from '@material-ui/icons/FormatBoldRounded';
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import IconButton from '@material-ui/core/IconButton';
import TitleIcon from '@material-ui/icons/Title';

interface INormalTextOptionProps {
  onClick: any;
}
const NormalTextOption = (props: INormalTextOptionProps) => {
  const { onClick } = props;

  return (
    <div className={'note-option-button__container'}>
      <IconButton onClick={onClick}>
        <TitleIcon />
      </IconButton>
    </div>
  );
};

interface IBoldOptionProps {
  onClick: any;
}
const BoldOption = (props: IBoldOptionProps) => {
  const { onClick } = props;

  return (
    <div className={'note-option-button__container'}>
      <IconButton onClick={onClick}>
        <FormatBoldRoundedIcon />
      </IconButton>
    </div>
  );
};

interface ICheckOptionProps {
  onClick: any;
}
const CheckOption = (props: ICheckOptionProps) => {
  const { onClick } = props;

  return (
    <div className={'note-option-button__container'}>
      {' '}
      <IconButton onClick={onClick}>
        <CheckCircleOutlineRoundedIcon />
      </IconButton>
    </div>
  );
};

interface INoteControlsProps {
  handleBold: any;
  handleNormalText: any;
  createTaskNote: any;
}
const NoteControls = (props: INoteControlsProps) => {
  const { handleBold, handleNormalText, createTaskNote } = props;

  return (
    <div className={'note-controls__container'}>
      <NormalTextOption onClick={handleNormalText} />
      <BoldOption onClick={handleBold} />
      <CheckOption onClick={createTaskNote} />
    </div>
  );
};

export default NoteControls;
