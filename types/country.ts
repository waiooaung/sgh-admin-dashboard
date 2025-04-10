export type CountryInfo = {
  flags: {
    png: string;
    svg: string;
    alt: string;
  };
  name: {
    common: string;
    official: string;
    nativeName: {
      [langCode: string]: {
        official: string;
        common: string;
      };
    };
  };
  idd: {
    root: string;
    suffixes: string[];
  };
};

export type CountryInfoApiResponse = {
  data: CountryInfo[];
};
