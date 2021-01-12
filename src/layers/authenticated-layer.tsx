import { createBrowserHistory } from 'history';
import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { Redirect, Router } from 'react-router';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import Axios from 'bloben-common/utils/axios';
import Notes from '../views/notes/Notes';
import NewTag from '../views/newTag/NewTag';
import { subscribeToPush } from '../bloben-package/utils/pushSubscription';
import { setServiceWorkerLister } from '../utils/ServiceWorkerListener';
import { logger, checkIfIsSafari } from '../bloben-common/utils/common';
import {
  sendWebsocketMessage,
  WEBSOCKET_GET_ALL_NOTES,
  WEBSOCKET_GET_ALL_TAGS,
  WEBSOCKET_GET_NOTES,
  WEBSOCKET_SYNC_NOTES,
} from '../api/notes';
import { setIsAppStarting, setIsFirstLogin } from '../redux/actions';
import { AxiosResponse } from 'axios';
import Search from '../views/search/Search';
import Settings from '../views/settings/Settings';
import WebsocketHandler from '../utils/WebsocketHandler';
import { getDataIds } from 'utils/common';
import TagSettings from '../views/tagSettings/TagSettings';
import IntroScreen from '../views/introScreen/IntroScreen';
import Modal from '../bloben-package/components/modal/Modal';

// STOMP WEBSOCKETS
let socket;
export let stompClient: any;

// BROWSER HISTORY
const history: any = createBrowserHistory();

const initialState = {
  notes: [],
  tags: [],
  passwords: [],
  notifications: [],
  selectedTag: '',
};

const AuthenticatedLayer = () => {
  const isFirstLogin: boolean = useSelector((state: any) => state.isFirstLogin);
  const isMobile: boolean = useSelector((state: any) => state.isMobile);
  const isAppStarting: boolean = useSelector(
    (state: any) => state.isAppStarting
  );
  const notesLastSynced: any = useSelector(
    (state: any) => state.notesLastSynced
  );
  const tagsLastSynced: any = useSelector((state: any) => state.tagsLastSynced);

  const dispatch: Dispatch = useDispatch();

  const closeWebsockets = () => {
    if (stompClient) {
      stompClient.disconnect();
    }
    logger('DISCONNECT WS');
  };

  useEffect(
    () => () => {
      // alert("AsDAd")
      closeWebsockets();
    },
    []
  );

  /**
   * Fetch all data on first login
   */
  const handleFirstLogin = (): void => {
    if (isFirstLogin) {
      sendWebsocketMessage(WEBSOCKET_GET_ALL_NOTES, { lastSync: null });
      dispatch(setIsFirstLogin(false));
    }
  };

  /**
   * Sync data on load
   */
  const sendIdsToSync = () => {
    // Get event and calendar ids
    const data: any = getDataIds();

    // if (data.tags && data.tags.length > 0) {
    //   sendWebsocketMessage(WEBSOCKET_SYNC_TAGS, data.tags)
    // }

    if (data.notes && data.notes.length > 0) {
      sendWebsocketMessage(WEBSOCKET_SYNC_NOTES, data.notes);
    }
  };

  const connectToWs = async (): Promise<void> => {
    // First verify if session is still active
    try {
      const response: AxiosResponse = await Axios.get('/user/account');
      if (response.status !== 200) {
        dispatch({ type: 'USER_LOGOUT' });

        return;
      }
      if (response.data && !response.data.username) {
        dispatch({ type: 'USER_LOGOUT' });

        return;
      }
    } catch (e) {
      // Return, user might be just offline
      return;
    }

    // Clear stompClient after lost connection
    socket = null;
    stompClient = null;

    // Need to create new instance on each reconnect with server
    socket = new SockJS(`${process.env.REACT_APP_API_URL as string}/ws`);
    stompClient = Stomp.over(socket);

    // Handle connection loss
    stompClient.debug = (frame: any) => {
      if (frame.indexOf('Connection closed') !== -1) {
        setTimeout(connectToWs, 7000);
      }
    };

    // Init connection
    stompClient.connect(
      'user',
      'password',
      () => {
        setTimeout(() => {
          handleFirstLogin();

          sendWebsocketMessage(WEBSOCKET_GET_ALL_TAGS, {
            dateFrom: tagsLastSynced,
          });
          sendWebsocketMessage(WEBSOCKET_GET_NOTES, {
            dateFrom: notesLastSynced,
          });
          sendIdsToSync();
          dispatch(setIsAppStarting(false));
          // Send all event and calendar ids to server to check if they exist
          // Return only ids of items to delete
          stompClient.subscribe('/user/notifications', (message: any) => {});
        }, 20);

        // Receive automatic updates from server
        // Receive automatic updates from server
        stompClient.subscribe('/user/sync', (message: any) => {
          console.log('mess', JSON.parse(message.body));
          WebsocketHandler.handleSyncGeneral(message);
        });
        stompClient.subscribe('/user/notes', (message: any) => {
          WebsocketHandler.getNotes(message.body);
        });
        stompClient.subscribe('/user/tags', (message: any) => {
          WebsocketHandler.getTags(message.body);
        });
        stompClient.send(
          '/app/notifications',
          {},
          JSON.stringify({ name: 'username' })
        );
        stompClient.send(
          '/app/updates',
          {},
          JSON.stringify({ name: 'store.username' })
        );
        // Do something
      },
      (e: any) => {
        connectToWs();
        console.log('ERROR ', e);
      }
    );
  };

  const initLoad = async () => {
    connectToWs();

    if (!checkIfIsSafari()) {
      await setServiceWorkerLister();
      await subscribeToPush();
    }
  };
  useEffect(() => {
    initLoad();
  }, []);

  return !isAppStarting ? (
    <div className={'app_wrapper'}>
      <Router history={history}>
        <Redirect to={'/notes'} />
        <Route exact path={'/new/tag'}>
          <Modal >
            <NewTag isNewTag={true} />
          </Modal>
        </Route>
        <Route exact path={'/tags'}>
          <Modal>
            <TagSettings />
          </Modal>
        </Route>
        <Route exact path={'/tag/:id'}>
          <Modal>
            <NewTag isNewTag={false} />
          </Modal>
        </Route>
        <Route exact path={'/search'}>
          {isMobile ? (
            <Modal>
              <Search />
            </Modal>
          ) : (
            <div
              style={{
                position: 'absolute',
                right: 150,
                top: 16,
                zIndex: 999,
                width: '30%',
              }}
            >
              <Modal>
                <Search />
              </Modal>
            </div>
          )}
        </Route>

        <Route path={'/notes'}>
          <Notes />
        </Route>
        <Route path={'/settings'}>
          {isMobile ? (
            <Modal >
              <Settings />
            </Modal>
          ) : (
            <Settings />
          )}
        </Route>
        <Route exact path={'/about'} render={() => <IntroScreen />} />
      </Router>
    </div>
  ) : null;
};

export default AuthenticatedLayer;
