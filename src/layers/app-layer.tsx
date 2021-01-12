import React, { useContext, useEffect } from 'react';
import AuthenticatedLayer from 'layers/authenticated-layer';
import Axios from 'bloben-common/utils/axios';
import GeneralApi from '../bloben-common/api/general.api';
import { logger } from '../bloben-common/utils/common';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAppStarting } from '../redux/actions';
import * as openpgp from 'openpgp';
import { Context } from '../bloben-package/context/store';
import AnonymView from '../bloben-package/layers/AnonymLayer';
import LoadingScreen from '../bloben-common/components/loadingScreen/LoadingScreen';

// Init webworker for better openpgp performance outside main thread
openpgp.initWorker({ path: 'openpgp.worker.js' });

const AppLayer = (props: any) => {
  const [store] = useContext(Context);
  const { isMobile } = store;

  // Hooks
  const dispatch: any = useDispatch();

  // Redux selectors
  const password: string = useSelector((state: any) => state.password);
  const isAppStarting: boolean = useSelector(
    (state: any) => state.isAppStarting
  );
  const isDark: boolean = useSelector((state: any) => state.isDark);
  const username: string = useSelector((state: any) => state.username);
  const isLogged: boolean = useSelector((state: any) => state.isLogged);

  useEffect(() => {
    GeneralApi.sendVisit(
      isMobile,
      (username !== null || username !== '') && username.length > 1
    );
  }, []);

  /*
   * First initialization of app
   * Try to load user from database or load remote with saved session
   */
  useEffect(() => {
    // Init authentication
    const initApp: any = async () => {
      dispatch(setIsAppStarting(true));

      // Username is in store
      if (username) {
        // Try to compare userData with server
        try {
          const userData: any = (await Axios.get('/user/account')).data;

          if (
            (userData.username && userData.username !== username) ||
            !userData.username
          ) {
            // TODO CLEAR REDUX
            // logOut(dispatch)
            dispatch(setIsAppStarting(false));
          }
        } catch (error) {
          logger(error);
        }
      } else {
        dispatch(setIsAppStarting(false));
      }
    };

    initApp();
  }, []);

  // Verify authentication
  const isAuthenticated: boolean =
    isLogged && username.length > 1 && password.length > 1;

  return (
    <div className={`root__wrapper${isDark ? '-dark' : ''}`}>
      {isAuthenticated ? <AuthenticatedLayer /> : <AnonymView />}
      {isAppStarting ? <LoadingScreen /> : null}
    </div>
  );
};

export default AppLayer;
