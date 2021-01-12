import React, { useContext } from 'react';
import './Settings.scss';
import EvaIcons from 'bloben-common/components/eva-icons';
import { Route, useHistory } from 'react-router-dom';
import { logOut } from '../../bloben-package/utils/logout';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import Modal from '../../bloben-package/components/modal/Modal';
import SettingsAccount from '../../bloben-package/views/settingsAccount/SettingsAccount';
import Appearance from '../../bloben-package/views/appearance/Appearance';
import SettingsSecurity from '../../bloben-package/views/settingsSecurity/SettingsSecurity';
import { Context } from '../../bloben-package/context/store';
import HeaderModal from '../../bloben-package/components/headerModal/HeaderModal';
import MobileTitle from '../../bloben-package/components/title/Title';
import SettingsItem from '../../bloben-package/components/settingsItem/SettingsItem';
import VersionFooter from '../../bloben-package/components/versionFooter/VersionFooter';

const SettingsRouter = (props: any) =>
    (
        <div>
            <Route path={'/settings/account'}>
                <Modal >
                    <SettingsAccount />
                </Modal>
            </Route>
            <Route path={'/settings/appearance'}>
                <Modal>
                    <Appearance />
                </Modal>
            </Route>
            <Route path={'/settings/security'}>
                <Modal>
                    <SettingsSecurity />
                </Modal>
            </Route>
            <Route exact path={'/settings'}>
                <Modal {...props}>
                    <SettingsBaseView />
                </Modal>
            </Route>
        </div>
    );
const SettingsRouterDesktop = () => {

    return   (
        <div style={{display: 'flex', flexDirection: 'row', height: '100%', width: '100%'}}>
            <div style={{display: 'flex', flexDirection: 'column', height: '100%', width: '30%'}}>
                <SettingsBaseView />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', height: '100%', width: '70%'}}>
                <Route path={'/settings/account'}>
                    <SettingsAccount />
                </Route>
                <Route path={'/settings/appearance'}>
                    <Appearance />
                </Route>
                <Route  path={'/settings/security'}>
                    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                        <SettingsSecurity />
                    </div>
                </Route>
            </div>
        </div>
    );
}


const SettingsBaseView = () => {
    const [store] = useContext(Context);
    const {isDark, isMobile} = store;

    const dispatch: Dispatch = useDispatch();

    const handleLogOut = async (): Promise<void> =>
        logOut(dispatch);

    return (
        <div className={`settings__wrapper_former${isDark ? '-dark' : ''}`}>
            {isMobile ? (
                    <HeaderModal/>
                ) :
                null
            }
            <div className={'settings__wrapper'}>
                <div className={'settings__container'}>
                    <MobileTitle title={'Settings'} />
                    <SettingsItem
                        icon={
                            <EvaIcons.Person
                                className={`svg-icon settings__icon${isDark ? '-dark' : ''}`}
                            />
                        }
                        title={'Account'}
                        link={'account'}
                        description={'Delete account'}
                    />
                    <SettingsItem
                        icon={
                            <EvaIcons.Lock
                                className={`svg-icon settings__icon${isDark ? '-dark' : ''}`}
                            />
                        }
                        title={'Security'}
                        link={'security'}
                        description={'Storage encryption'}
                    />
                    <SettingsItem
                        icon={
                            <EvaIcons.Palette
                                className={`svg-icon settings__icon${isDark ? '-dark' : ''}`}
                            />
                        }
                        title={'Appearance'}
                        link={'appearance'}
                        description={'Theme'}
                    />
                    <SettingsItem
                        onClick={() => {window.location.assign('https://bloben.com')}}
                        icon={
                            <EvaIcons.Info
                                className={`svg-icon settings__icon${isDark ? '-dark' : ''}`}
                            />
                        }
                        title={'About Bloben'}
                    />
                    <SettingsItem
                        onClick={handleLogOut}
                        icon={
                            <EvaIcons.Power
                                className={`svg-icon settings__icon${isDark ? '-dark' : ''}`}
                            />
                        }
                        title={'Logout'}
                    />
                </div>
                <VersionFooter />
            </div>
        </div>
    )
}
const SettingsView = () => {
    const [store] = useContext(Context);
    const {isMobile} = store;

    return (
        isMobile ? <SettingsRouter /> : <SettingsRouterDesktop />
    );
};


const Settings = () =>
    <SettingsView />;

export default Settings;
