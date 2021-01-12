import React, {
  useEffect,
  useReducer,
  useState,
  useContext,
} from 'react';
import './Notes.scss';
import Note from '../../components/note/Note';
import StateReducer from '../../bloben-package/utils/state-reducer';
import Utils from './Notes.utils';
import { Router, Switch, useHistory } from 'react-router';
import BottomSheet from 'bottom-sheet-react';
import NoteStateEntity from '../../data/entities/state/note.entity';
import NoteSettings from '../noteSettings/NoteSettings';
import { Route } from 'react-router-dom';
import EditNote from '../../components/note/editNote/EditNote';
import { mapTags } from '../../utils/common';
import { ButtonBase } from '@material-ui/core';
import EvaIcons from '../../bloben-common/components/eva-icons';
import { useDispatch, useSelector } from 'react-redux';
import Search from '../search/Search';
import Navbar from '../../components/navbar/Navbar';
import { selectTag, setMappedTags, setSortedNotes } from '../../redux/actions';
import { hookHeight } from 'bottom-sheet-react/utils';
import Drawer from '../../bloben-package/components/drawer/Drawer';
import Header from '../../bloben-package/components/header/Header';
import HeaderDesktop from '../../bloben-package/components/headerDesktop/HeaderDesktop';
import MobileTitle from '../../bloben-package/components/title/Title';
import Modal from '../../bloben-package/components/modal/Modal';
import { Context } from '../../bloben-package/context/store';
import { parseCssDark } from '../../bloben-common/utils/common';

interface INotesListProps {
  data: any;
  mappedTags: any;
}
const NotesList = (props: INotesListProps) => {
  const { data, mappedTags } = props;
  const history = useHistory();

  const pathName: string = history.location.pathname;
  // tslint:disable-next-line:no-magic-numbers
  const selectedId: string = pathName.slice(6);

  return data.map((item: any) => {
    // Don't render soft deleted notes waiting for sync with server
    if (!item.deletedAt) {
      return (
        <Note
          key={item.id}
          note={item}
          selectedId={selectedId}
          mappedTags={mappedTags}
        />
      );
    }
  });
};

interface INotesViewProps {
  results: any;
  setState: any;
  triggerSorting: any;
  openNewNote: any;
  openTags: any;
  openSettings: any;
  hasHeaderShadow: boolean;
  handleScroll: any;
  handleClose: any;
  drawerIsOpen: boolean;
  settingsAreOpen: boolean;
  typedText: string;
  onSearchInput: any;
  handleClearSearch: any;
}
const NotesView = (props: INotesViewProps) => {
  const [store] = useContext(Context);
  const { isDark, isMobile } = store;

  const dispatch: any = useDispatch();

  const {
    results,
    setState,
    triggerSorting,
    openNewNote,
    openTags,
    openSettings,
    hasHeaderShadow,
    handleScroll,
    handleClose,
    drawerIsOpen,
    settingsAreOpen,
    typedText,
    onSearchInput,
    handleClearSearch,
  } = props;

  const searchIsOpen: boolean = useSelector((state: any) => state.searchIsOpen);
  const tags: any = useSelector((state: any) => state.tags);
  const mappedTags: any = useSelector((state: any) => state.mappedTags);
  const notes: any = useSelector((state: any) => state.notes);
  const selectedTag: any = useSelector((state: any) => state.selectedTag);
  const sortedNotes: any = useSelector((state: any) => state.sortedNotes);

  const history = useHistory();
  const tagsData: any = [{ id: null, name: 'All notes' }, ...tags];
  const height: any = hookHeight();

  const rowStyle: any = {
    height: !isMobile ? `${height - 60}px` : '',
  };

  const handleSelectTag = (item: any) => {
    dispatch(selectTag(item));
    handleClose('drawerIsOpen');
  };

  return (
    <div
      className={`wrapper ${
        isDark || !isMobile ? 'dark_background' : 'light_background'
      }`}
    >
      <div className={'row'}>
        {isMobile ? null : (
          <Drawer
            data={tagsData}
            title={'Notes'}
            selectedItem={selectedTag}
            selectItem={handleSelectTag}
            handleCloseModal={() => {}}
           addItemPath={''}/>
        )}
        <div className={'wrapper-notes'}>
          {!isMobile ? null : (
            <Header
              title={selectedTag ? selectedTag.name : 'All notes'}
              hasHeaderShadow={hasHeaderShadow}
              onClick={openTags}
            >
              <div />
            </Header>
          )}
          <div className={'row'}>
            <div
              style={
                isMobile
                  ? {
                      height: '100%',
                      flexDirection: 'column',
                      display: 'flex',
                      width: '100%',
                    }
                  : {
                      height: '100%',
                      flexDirection: 'column',
                    }
              }
            >
              {!isMobile ? (
                <HeaderDesktop>
                  <Search
                    onSearchInput={onSearchInput}
                    handleClearSearch={handleClearSearch}
                    typedText={typedText}
                    setState={setState}
                  />
                  <ButtonBase
                    className={'header__add-button'}
                    onClick={openNewNote}
                  >
                    <EvaIcons.PlusCircle
                      className={'svg-icon plus-icon'}
                      style={{ marginRight: 8 }}
                    />
                  </ButtonBase>
                </HeaderDesktop>
              ) : null}
              <div
                className={`${parseCssDark(
                  'notes__container',
                  isDark
                )} ${parseCssDark('border-right', isDark)}`}
                onScroll={handleScroll}
                style={rowStyle}
              >
                {searchIsOpen ? null : (
                  <MobileTitle
                    title={selectedTag.name ? selectedTag.name : 'All notes'}
                  />
                )}
                {/*{notes.length === 0 && !searchIsOpen ? (*/}
                {/*  <ContentEmpty screen={'notes'} text={'Nothing to do'} />*/}
                {/*) : null}*/}
                {sortedNotes.length > 0 ? (
                  <NotesList
                    data={typedText ? results : sortedNotes}
                    mappedTags={mappedTags}
                  />
                ) : null}
              </div>
              {drawerIsOpen ? (
                <BottomSheet
                  backdropClassName={
                    isDark ? 'bottom-sheet__backdrop--dark' : ''
                  }
                  containerClassName={
                    isDark ? 'bottom-sheet__container--dark' : ''
                  }
                  customHeight={(height / 4) * 3}
                  isExpandable={false}
                  onClose={() => handleClose('drawerIsOpen')}
                >
                  <Drawer
                    addButtonText={'Tags settings'}
                    data={tagsData}
                    title={'Tags'}
                    addItemPath={'/tags'}
                    selectedItem={selectedTag}
                    selectItem={handleSelectTag}
                    handleCloseModal={() => handleClose('drawerIsOpen')}
                  />
                </BottomSheet>
              ) : null}
              {settingsAreOpen ? (
                <BottomSheet
                  backdropClassName={
                    isDark ? 'bottom-sheet__backdrop--dark' : ''
                  }
                  containerClassName={
                    isDark ? 'bottom-sheet__container--dark' : ''
                  }
                  isExpandable={false}
                  onClose={() => handleClose('settingsAreOpen')}
                >
                  <NoteSettings
                    handleCloseModal={() => handleClose('settingsAreOpen')}
                  />
                </BottomSheet>
              ) : null}
              {isMobile && !searchIsOpen ? (
                <Navbar
                  handleCenterClick={openNewNote}
                  handleLeftClick={openTags}
                  handleRightClick={openSettings}
                />
              ) : null}
            </div>
            {isMobile ? (
              <Route path={'/notes/new'}>
                <Modal>
                  <EditNote
                    tags={tags}
                    notes={notes}
                    setState={setState}
                    mappedTags={mappedTags}
                    isNewNote={true}
                    triggerSorting={triggerSorting}
                  />
                </Modal>
              </Route>
            ) : null}
            {isMobile ? (
              <Route path={'/notes/note/:noteId'}>
                <Modal>
                  <EditNote
                    isNewNote={false}
                    tags={tags}
                    notes={notes}
                    setState={setState}
                    mappedTags={mappedTags}
                    triggerSorting={triggerSorting}
                  />
                </Modal>
              </Route>
            ) : null}
            {!isMobile ? (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  flexDirection: 'column',
                }}
              >
                <Header>
                  <div />
                </Header>
                {!isMobile ? (
                  <div
                    style={{
                      height: '100%',
                      flexDirection: 'column',
                      width: '100%',
                    }}
                  >
                    <div className={'desktop-col'}>
                      <Router history={history}>
                        <Switch>
                          <Route path={'/notes/new'}>
                            <EditNote
                              isNewNote={true}
                              tags={tags}
                              notes={notes}
                              setState={setState}
                              selectedTag={selectedTag}
                              mappedTags={mappedTags}
                              triggerSorting={triggerSorting}
                            />
                          </Route>
                          <Route exact path={'/notes/note/:noteId'}>
                            {notes.length > 0 ? (
                              <EditNote
                                tags={tags}
                                notes={notes}
                                setState={setState}
                                mappedTags={mappedTags}
                                triggerSorting={triggerSorting}
                               isNewNote={false}/>
                            ) : null}
                          </Route>
                        </Switch>
                      </Router>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

interface INotesProps {
  setState?: any; // TODO remove?
}
const Notes = (props: INotesProps) => {
  const [hasHeaderShadow, setHeaderShadow] = useState(false);
  const [notesState, dispatchState]: any = useReducer(
    StateReducer,
    Utils.initialState
  );

  const { setState } = props;
  const {
    isScrolling,
    drawerIsOpen,
    settingsAreOpen,
    sortingTrigger,
    typedText,
    results,
  } = notesState;

  const history: any = useHistory();
  const [store] = useContext(Context);
  const {isMobile} = store;

  const dispatch: any = useDispatch();

  const tags: any = useSelector((state: any) => state.tags);
  const notes: any = useSelector((state: any) => state.notes);
  const sortedNotes: any = useSelector((state: any) => state.sortedNotes);
  const selectedTag: any = useSelector((state: any) => state.selectedTag);

  const getSortedNotes = async (
    isFirstRender: boolean = false,
    rule: string = 'updatedAt'
  ) => {
    const tagNotes: any = NoteStateEntity.getNotes(
      selectedTag.id ? selectedTag.id : null,
      notes
    );
    if (tagNotes.length === 0) {
      dispatch(setSortedNotes([]));

      return;
    }
    const sortedNotesResult: any = await NoteStateEntity.getOrder(tagNotes);

    dispatch(setSortedNotes(sortedNotesResult));

    // Load view for first note in list on desktop
    if (!isMobile && isFirstRender) {
      history.push(`/notes/note/${sortedNotes[0].id}`);
    }
  };

  // Map tags to object on load
  useEffect(() => {
    const tagsObj: any = mapTags(tags);
    dispatch(setMappedTags(tagsObj));
  }, []);

  // Map tags to object on tags change
  useEffect(() => {
    const tagsObj: any = mapTags(tags);
    dispatch(setMappedTags(tagsObj));
  }, [tags.length]);

  useEffect(() => {
    getSortedNotes(true);
  }, []);

  useEffect(() => {
    getSortedNotes();
  }, [selectedTag.id, sortingTrigger, notes.length, notes, tags.length]);

  const setLocalState = (stateName: string, type: string, data: any): void => {
    const payload: any = { stateName, type, data };
    // @ts-ignore
    dispatchState({ state, payload });
  };
  const handleScroll = (e: any) => {
    if (!isScrolling) {
      setLocalState('isScrolling', 'simple', true);
    }
    if (e.target.scrollTop > 0) {
      setHeaderShadow(true);
    } else {
      setHeaderShadow(false);
    }
  };

  //**
  // Search functions
  const search = (searchData: any[], keyWord: string) =>
    searchData.filter(
      (item: any) =>
        item.text.toLowerCase().indexOf(keyWord.toLowerCase()) !== -1 ||
        item.title.toLowerCase().indexOf(keyWord.toLowerCase()) !== -1
    );
  const onSearchInput = (event: any) => {
    setLocalState('typedText', 'simple', event.target.value);
  };

  const handleClearSearch = () => {
    setLocalState('typedText', 'simple', '');
    setLocalState('results', 'simple', []);
  };
  useEffect(() => {
    if (typedText.length < 1) {
      setLocalState('results', 'simple', []);

      return;
    }
    const foundItems: any[] = search(notes, typedText);

    setLocalState('results', 'simple', foundItems);
  }, [typedText]);
  // Search functions end
  //**

  const triggerSorting = () => {
    const trigger: string = `${sortingTrigger}1`;
    setLocalState('sortingTrigger', 'simple', trigger);
  };
  const openTags = (): void => {
    setLocalState('drawerIsOpen', 'simple', true);
  };
  const openSettings = (): void => {
    history.push('/settings');
  };
  const openNewNote = (): void => {
    history.push('/notes/new');
  };
  const handleClose = (state: string) => {
    setLocalState(state, 'simple', false);
  };

  return (
    <NotesView
      openNewNote={openNewNote}
      handleScroll={handleScroll}
      hasHeaderShadow={hasHeaderShadow}
      setState={setState}
      triggerSorting={triggerSorting}
      settingsAreOpen={settingsAreOpen}
      openSettings={openSettings}
      handleClose={handleClose}
      drawerIsOpen={drawerIsOpen}
      openTags={openTags}
      onSearchInput={onSearchInput}
      handleClearSearch={handleClearSearch}
      typedText={typedText}
      results={results}
    />
  );
};

export default Notes;
