import React, { useContext, useEffect, useState } from 'react';
import './Search.scss';
import { useHistory } from 'react-router-dom';
import SearchImg from 'assets/search.svg';
import Note from '../../components/note/Note';
import { useDispatch, useSelector } from 'react-redux';
import { mapTags } from '../../utils/common';
import { setMappedTags } from '../../redux/actions';
import {
  TASKS_NOTE_DATA,
  TEXT_NOTE_DATA,
} from '../../data/entities/state/note.entity';
import { Input } from '../../bloben-package/components/input/Input';
import { Context } from '../../bloben-package/context/store';
import SearchHeader from '../../bloben-package/components/searchHeader/SearchHeader';

const MIN_LEN_FOR_SEARCH: number = 3;

const SearchImage = () => (
  <div className={'content_empty__wrapper'}>
    <img className={'content_empty__image'} src={SearchImg} alt={'empty'} />
  </div>
);

const renderResults = (data: any[], mappedTags: any) =>
  data.map((item: any) => (
    <Note note={item} mappedTags={mappedTags} />
  ));

interface IResultsProps {
  results: any;
  mappedTags: any;
}
const Results = (props: IResultsProps) => {
  const { results, mappedTags } = props;

  const renderedResults = renderResults(results, mappedTags);

  return <div className={'search__container-results'}>{renderedResults}</div>;
};

interface IMobileViewProps {
  results: any;
  mappedTags: any;
}
const MobileView = (props: IMobileViewProps) => {
  const { results, mappedTags } = props;

  return results.length > 0 ? (
    <Results results={results} mappedTags={mappedTags} />
  ) : (
    <SearchImage />
  );
};
interface IDesktopViewProps {
  results: any;
  mappedTags: any;
}
const DesktopView = (props: IDesktopViewProps) => {
  const { results, mappedTags } = props;

  return results.length > 0 ? (
    <Results results={results} mappedTags={mappedTags} />
  ) : null;
};

const SearchView = (props: any) => {
  const {
    typedText,
    results,
    goBack,
    onSearchInput,
    handleClearSearch,
  } = props;

  const [store] = useContext(Context);
  const {isMobile} = store;

  const mappedTags: any = useSelector((state: any) => state.mappedTags);

  return (
    <div className={'search__wrapper'}>
      <SearchHeader
        typedText={typedText}
        onSearchInput={onSearchInput}
        handleClearSearch={handleClearSearch}
        goBack={goBack}
      />
      {isMobile ? (
        <MobileView
          results={results}
          mappedTags={mappedTags}
        />
      ) : (
        <DesktopView
          results={results}
          mappedTags={mappedTags}
        />
      )}
    </div>
  );
};

const Search = () => {
  const [typedText, setTypedText] = useState('');
  const [results, setResults]: any = useState([]);
  const tags: any = useSelector((state: any) => state.tags);
  const notes: any = useSelector((state: any) => state.notes);

  const dispatch: any = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const tagsObj: any = mapTags(tags);
    dispatch(setMappedTags(tagsObj));
  }, []);

  const goBack = () => {
    history.goBack();
  };

  const onSearchInput = (event: any) => {
    setTypedText(event.target.value);
  };

  /**
   * Search keyword in body, check text and task components
   * @param note
   * @param keyWord
   */
  const findTextInNotesBody = (note: any, keyWord: string): boolean => {
    if (!note.body || (note.body && note.body.length < 0)) {
      return false;
    }

    for (const item of note.body) {
      // Search rules for different components
      const { data, type } = item;

      if (type === TEXT_NOTE_DATA) {
        if (data.toLowerCase().indexOf(keyWord.toLowerCase()) !== -1) {
          return true;
        }
      }

      // Check each task text
      if (type === TASKS_NOTE_DATA) {
        for (const oneTask of data) {
          if (
            oneTask.text.toLowerCase().indexOf(keyWord.toLowerCase()) !== -1
          ) {
            return true;
          }
        }
      }
    }

    return false;
  };

  const search = (searchData: any[], keyWord: string) =>
    searchData.filter((item: any) => {
      // Find match in body
      const matchInText: boolean = findTextInNotesBody(item, keyWord);

      if (
        item.title.toLowerCase().indexOf(keyWord.toLowerCase()) !== -1 ||
        matchInText
      ) {
        return item;
      }
    });

  const handleClearText = () => {
    setTypedText('');
    setResults([]);
  };

  const handleClearSearch = () => {
    setTypedText('');
    setResults([]);
  };

  useEffect(() => {
    if (typedText.length < MIN_LEN_FOR_SEARCH) {
      setResults([]);

      return;
    }
    const foundItems: any[] = search(notes, typedText);

    setResults(foundItems);
  }, [typedText]);

  return (
    <SearchView
      typedText={typedText}
      results={results}
      goBack={goBack}
      onSearchInput={onSearchInput}
      handleClearSearch={handleClearSearch}
      handleClearText={handleClearText}
    />
  );
};

export default Search;
