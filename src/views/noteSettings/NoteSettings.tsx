import React, { useContext } from 'react';
import './NoteSettings.scss';
import { ButtonBase } from '@material-ui/core';
import { useHistory, useParams } from 'react-router';
import { Context } from '../../bloben-package/context/store';

interface INoteSettingsItemProps {
  onClick: any;
  title: string;
}
const NoteSettingsItem = (props: INoteSettingsItemProps) => {
  const { onClick, title } = props;

  const [store] = useContext(Context);
  const {isDark} = store;

  return (
    <ButtonBase
      className={`list-settings__item-container`}
      onClick={onClick}
    >
      <p
        className={`list-settings__item-text${
          isDark ? '-dark' : ''
        }`}
      >
        {title}
      </p>
    </ButtonBase>
  );
};

interface INoteSettingsViewProps {
  handleEditList: any;
  navigateTo: any;
}
const NoteSettingsView = (props: INoteSettingsViewProps) => {
  const {
    handleEditList,
    navigateTo,
  } = props;

  return (
    <div className={'list-settings__container'}>
      <NoteSettingsItem title={'Edit list'} onClick={handleEditList} />
      <NoteSettingsItem
        title={'Settings'}
        onClick={() => navigateTo('/settings')}
      />
    </div>
  );
};

const NoteSettings = (props: any) => {
  const { handleDeleteList, handleEditList, handleCloseModal } = props;
  const history = useHistory();
  const params = useParams();

  const navigateTo = (path: string) => {
    handleCloseModal();
    history.push(path);
  };

  const handleEditListWithClose = () => {
    handleCloseModal();
    handleEditList();
  };

  const handleDeleteListWithClose = () => {
    handleCloseModal();
    handleDeleteList();
  };

  return (
    <NoteSettingsView
      handleEditList={handleEditListWithClose}
      navigateTo={navigateTo}
    />
  );
};

export default NoteSettings;
