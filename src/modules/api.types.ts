export interface ILoginResponse {
    id: number;
    country: 'Australia' | string;
    fullname: string;
    confirmcode: number;
    userunits: number;
    addbuilding: number;
    addunit: number;
    countryinfo: {
      country: 'Australia' | 'New Zealand' | string;
      companyname: string;
      supportphone: string;
      supporturl: string;
      addunitnote: string;
    }[];
    features: {
      groupcontrol: number;
      zonerules: number;
      halfdegcontrol: number;
    };
}

export interface ILogoutResponse {
  status: 'loggedout';
}