import React from 'react';
import i18n from './i18n';
import { withTranslation } from 'react-i18next';


function App18 ({ t }) {
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        sessionStorage.setItem("language",lng);

    }

    const handleChange = (event) => {
        changeLanguage(event.target.value);
    };

    return (
                <select className="btn btn-outline-info form-select ms-0"
                        onChange={handleChange}
                        defaultValue={sessionStorage.getItem("language")}
                        name="language"
                        id={"language_selector"}
                >
                    <option value={'es'}>Español</option>
                    <option value={'en'}>English</option>
                </select>
    )
}

export default withTranslation()(App18);