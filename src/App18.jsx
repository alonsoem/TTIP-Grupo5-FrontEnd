import React from 'react';
import i18n from './i18n';
import { withTranslation } from 'react-i18next';


function App18 ({ t }) {
    const changeLanguage = (lng) => {
        console.log(lng);
        i18n.changeLanguage(lng);
        localStorage.setItem("language",lng);

    }

    const handleChange = (event) => {
        changeLanguage(event.target.value);
    };

    return (
                <select class="btn btn-outline-info form-select ms-0"
                        onChange={handleChange}
                        defaultValue={localStorage.getItem("language")}
                        name="language"
                        id={"language_selector"}
                >
                    <option value={'es'}>Español</option>
                    <option value={'en'}>English</option>
                </select>
    )
}

export default withTranslation()(App18);