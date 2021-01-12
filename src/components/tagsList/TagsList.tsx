import React, { useContext } from 'react';
import './TagsList.scss';
import CheckBoxOutlineBlankRoundedIcon from '@material-ui/icons/CheckBoxOutlineBlankRounded';
import CheckBoxRoundedIcon from '@material-ui/icons/CheckBoxRounded';
import { ButtonBase, IconButton } from '@material-ui/core';
import { Context } from '../../bloben-package/context/store';

interface IOneTagProps {
  tag: any;
  selectTag: any;
  isSelected: boolean;
}
const OneTag = (props: IOneTagProps) => {
  const { tag, selectTag, isSelected } = props;

  const { name } = tag;

  const handleSelectTag = (): void => selectTag(tag.id);

  return (
    <ButtonBase onClick={handleSelectTag} className={'tags-list__button'}>
      <div className={'tags-list__container'}>
        <IconButton onClick={handleSelectTag}>
          {isSelected ? (
            <CheckBoxRoundedIcon />
          ) : (
            <CheckBoxOutlineBlankRoundedIcon />
          )}
        </IconButton>
        <p className={'tags-list__text'}>{name}</p>
      </div>
    </ButtonBase>
  );
};

const renderTags = (tags: any, selectedTags: any, selectTag: any) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  return tags.map((tag: any) => {
    const isSelected: boolean = selectedTags.indexOf(tag.id) !== -1;

    if (!tag.deletedAt) {
      return <OneTag tag={tag} selectTag={selectTag} isSelected={isSelected} />;
    }
  });
};

interface ITagsListViewProps {
  tags: any;
  selectTag: any;
  selectedTags: any;
}
const TagsListView = (props: ITagsListViewProps) => {
  const [store] = useContext(Context);
  const { isDark, isMobile } = store;

  const { tags, selectTag, selectedTags } = props;

  const renderedTags: any = renderTags(tags, selectedTags, selectTag);

  return (
    <div className={'tags-list__wrapper'}>
      {isMobile ? (
        <div style={{ padding: 16, paddingLeft: 24 }}>
          <h5 className={`drawer__title${isDark ? '-dark' : ''}`}>Tags</h5>
        </div>
      ) : null}
      {renderedTags}
    </div>
  );
};

interface ITagsListProps {
  tags: any;
  selectTag: any;
  selectedTags: any;
}
const TagsList = (props: ITagsListProps) => {
  const { tags, selectTag, selectedTags } = props;

  return (
    <TagsListView
      tags={tags}
      selectTag={selectTag}
      selectedTags={selectedTags}
    />
  );
};

export default TagsList;
