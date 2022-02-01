export interface CountriesI {
  _id?            : string;
  name            : string;
  topLevelDomain? : string[];
  alpha2Code      : string;
  alpha3Code      : string;
  callingCodes    : string[];
  capital         : string;
  altSpellings?   : string[];
  subregion?      : string;
  region          : string;
  population      : number;
  latlng?         : number[];
  demonym         : string;
  area            : number;
  gini            : number;
  timezones?      : string[];
  borders?        : string[];
  nativeName      : string;
  numericCode     : string;
  flags           : any[];
  currencies      : any[];
  languages?      : any[];
  regionalBlocs?  : any[];
  cioc            : string;
  independent     : boolean;
}
  
export class FlagsI {
  readonly doc = "flags";
  
  _id? : string;
  svg? : string;
  png? : string;
}

export class CurrenciesI {
  readonly doc = "currencies";

  id?    : string;
  code   : string;
  name   : string;
  symbol : string;
}

export class LanguagesI {
  readonly doc = "languages";

  iso639_1   : string;
  iso639_2   : string;
  name       : string;
  nativeName : string;
}

export class RegionalBlocsI {
  readonly doc = "regional_blocs";

  _id     : string;
  acronym : string;
  name    : string;
}
  