var i18nTranslations = {
    "en": {
        btnGetAtmoText: "Get Pressure Graph",
        placeHolderEnterCity: "Enter City Name",
        eCheckCityName: "Error occurred while getting data. Please check city name",
        lDataForCity: "Data for city: ",
        lPressureDecrease: "Pressure will decrease by ",
        lPressureIncrease: "Pressure will increase by "
    },
    "ru": {
        btnGetAtmoText: "Получить график давления",
        placeHolderEnterCity: "Название города",
        eCheckCityName: "Ошибка во время получения данных. Проверьте название города",
        lDataForCity: "Данные для города: ",
        lPressureDecrease: "Давление уменшиться на ",
        lPressureIncrease: "Давление увеличиться на "
    },
    "uk": {
        btnGetAtmoText: "Отримати графік тиску",
        placeHolderEnterCity: "Назва міста",
        eCheckCityName: "Помилка під час отриманні даних. Перевірте назву міста",
        lDataForCity: "Дані для міста: ",
        lPressureDecrease: "Тиск понизиться на ",
        lPressureIncrease: "Тиск збільшиться на "
    }
};

export function i18n() {
    return {
        getTranslationForKey: function(sKey) {
            var locale = navigator.language;
            if (locale === "uk-UA") {
                locale = "uk";
            } else if (locale === "en-US") {
                locale = "en";
            } else if (locale === "ru-RU") {
                locale = "ru";
            }

            if (i18nTranslations.hasOwnProperty(locale)) {
                return i18nTranslations[locale][sKey];
            } else {
                return sKey;
            }
        },
        getAvailableTranslations: function() {
            var aProps = [],
                prop;
            for (prop in i18nTranslations) {
                if (i18nTranslations.hasOwnProperty(prop)) {
                    aProps.push(prop);
                }
            }
            return aProps;
        }
    };
}