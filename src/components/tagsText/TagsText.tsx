import React from 'react';
import './TagsText.scss';

interface ITagTextProps {
  name: string;
}
const TagText = (props: ITagTextProps) => {
  const { name } = props;

  return <p className={'note__tag-text'}>#{name}</p>;
};

const renderTags = (noteTags: any, mappedTags: any) => {
  if (!noteTags || noteTags.length === 0) {
    return null;
  }

  return noteTags.map((tagId: any) => {
    if (mappedTags[tagId]) {
      const tagName: string = mappedTags[tagId].name;

      return <TagText key={tagId} name={tagName} />;
    }
  });
};

interface ITagsTextProps {
  note: any;
  mappedTags: any;
}
const TagsText = (props: ITagsTextProps) => {
  const { note, mappedTags } = props;

  return renderTags(note.tags, mappedTags);
};

export default TagsText;
