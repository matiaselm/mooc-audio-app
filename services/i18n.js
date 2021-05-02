import React from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fi from '../assets/localization/fi.json';
import en from '../assets/localization/en.json';

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
            en_EN: {
                translation:  en,
            },
            fi_FI: {
                translation: fi,
            }
        },
        lng: "en_EN",
        fallbackLng: "en_EN",

        interpolation: {
            escapeValue: false
        }
    });

export default i18n;