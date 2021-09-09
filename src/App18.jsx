import React from 'react';
import i18n from './i18n';
import { withTranslation } from 'react-i18next';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";


function App18 ({ t }) {
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    }

    const handleChange = (event) => {
        changeLanguage(event.target.value);
    };

    return (

            <FormControl >
                <InputLabel htmlFor="language_selector">{t("lang")}</InputLabel>
                <NativeSelect
                    defaultValue={'es'}
                    inputProps={{
                        name: 'language',
                        id: 'language_selector',
                    }}
                    onChange={handleChange}

                >
                    <option value={'es'}>Español</option>
                    <option value={'en'}>English</option>

                </NativeSelect>

            </FormControl>
    )
}

export default withTranslation()(App18);