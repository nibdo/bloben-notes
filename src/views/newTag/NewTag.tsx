import React, { useContext, useEffect, useReducer } from 'react';
import { useParams } from 'react-router';
import Utils from './NewTag.utils';
import StateReducer from 'bloben-package/utils/state-reducer';
import './NewTag.scss';
import TagStateEntity, {
  TagBodyToSend,
} from '../../data/entities/state/tag.entity';
import {
  sendWebsocketMessage,
  WEBSOCKET_CREATE_TAG,
  WEBSOCKET_UPDATE_TAG,
} from '../../api/notes';
import { useDispatch, useSelector } from 'react-redux';
import { addTag, updateTag } from '../../redux/actions';
import { PgpKeys } from '../../bloben-package/utils/OpenPgp';
import { findInArrayById } from '../../bloben-package/utils/common';
import HeaderModal from '../../bloben-package/components/headerModal/HeaderModal';
import { Context } from '../../bloben-package/context/store';
import { Input } from '../../bloben-package/components/input/Input';

interface INewTagView {
  name: string;
  onChange: any;
  handleBlur: any;
  handleKeyDown: any;
}
const NewTagView = (props: INewTagView) => {
  const { name, onChange, handleBlur, handleKeyDown } = props;

  const [store] = useContext(Context);
  const { isDark } = store;

  return (
    <div className={'new-notebook__wrapper'}>
      <HeaderModal
        hasHeaderShadow={true}
        handleSave={handleBlur}
        title={'New tag'}
      />
      <div className={`new-notebook__container${isDark ? '-dark' : ''}`}>
        <Input
          className={`edit-task__input${isDark ? '-dark' : ''}`}
          placeholder={'Type tag name'}
          autoFocus={true}
          name={'name'}
          value={name}
          onChange={onChange}
          multiline={false}
          submitEnter={handleKeyDown}
        />
      </div>
    </div>
  );
};

interface INewTagProps {
  isNewTag: boolean;
}
const NewTag = (props: INewTagProps) => {
  const { isNewTag } = props;

  const [newTagState, dispatchState]: any = useReducer(
    StateReducer,
    Utils.initialState
  );
  const pgpKeys: PgpKeys = useSelector((state: any) => state.pgpKeys);
  const tags: any = useSelector((state: any) => state.tags);

  const params: any = useParams();
  const dispatch: any = useDispatch();

  const { name, tag } = newTagState;
  const { id } = params;

  const setLocalStateState = (stateName: string, data: any): void => {
    // Change local state based on type
    const payload: any = { stateName, type: 'simple', data };
    // @ts-ignore
    dispatchState({ newTagState, payload });
  };

  const getTag = (tagId: string) => {
    const tagFound: any = findInArrayById(tags, tagId);

    setLocalStateState('tag', tagFound);
  };
  useEffect(() => {
    if (!isNewTag) {
      getTag(id);
    }
  }, [id]);

  const onChange = (event: any) => {
    const target: any = event.target;
    setLocalStateState(target.name, event.target.value);
  };

  const handleBlur = async () => {
    if (name) {
      await saveTag();
    }
  };

  // NEW
  const saveTag = async () => {
    // Different handling for new event and edited event
    if (isNewTag) {
      const newTag: TagStateEntity = new TagStateEntity({
        name,
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
    } else {
      const newTag: TagStateEntity = new TagStateEntity(tag);
      newTag.name = name;

      // Encrypt data
      const bodyToSend: TagBodyToSend = await newTag.formatBodyToSendPgp(
        pgpKeys.publicKey
      );

      // Get only simple object
      const simpleObj: TagStateEntity = newTag.getStoreObj();

      // Save to redux store
      dispatch(updateTag(simpleObj));

      sendWebsocketMessage(WEBSOCKET_UPDATE_TAG, bodyToSend);
    }
  };

  return (
    <NewTagView
      handleBlur={handleBlur}
      onChange={onChange}
      handleKeyDown={handleBlur}
      name={'name'}
    />
  );
};

export default NewTag;
