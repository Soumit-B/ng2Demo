export var LocaleCulture = (function () {
    function LocaleCulture(name, localeKey, language, country, languageCode, countryCode, localeCode, iCABSLanguageCode) {
        this.name = name;
        this.localeKey = localeKey;
        this.language = language;
        this.country = country;
        this.languageCode = languageCode;
        this.countryCode = countryCode;
        this.localeCode = localeCode;
        this.iCABSLanguageCode = iCABSLanguageCode;
    }
    return LocaleCulture;
}());
