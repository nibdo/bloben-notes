import React from 'react';
import 'bloben-common/index.scss';
import Store from './bloben-package/context/store';
import StorageLayer from './bloben-package/layers/StorageLayer';

const App = () =>

    (
        <Store>
            <StorageLayer/>
        </Store>
    )

export default App;
