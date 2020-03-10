const axios = require('axios');

class Places {
    private placeName: string;
    private longitude: string;
    private latitude: string;
    private state: string;
    private stateAbbreviation: string;

    constructor(json: any) {
        if(json) {
            this.placeName = json["place name"];
            this.longitude = json["longitude"];
            this.latitude = json["latitude"];
            this.state = json["state"];
            this.stateAbbreviation = json["state abbreviation"];
        }
    }
}

class ZipCodeData {
    private postCode: string;
    private country: string;
    private countryAbbreviation: string;
    private places: Array<Places> = [];

    constructor(json: any) {
        if(json) {
            this.postCode = json["post code"];
            this.country = json["country"];
            this.countryAbbreviation = json["country abbreviation"];
            if(json["places"] instanceof Array) {
                json["places"].map((res) => {
                    this.places.push(new Places(res));
                })
            }
        }
    }
}

class Application {
    private apiUrl: string = 'http://api.zippopotam.us/us/';
    public zipCodeInput: string;

    async fetchData(zipcode: string): Promise<string> {
        let response = await axios.get(this.apiUrl + zipcode);
        let zipCodeData = new ZipCodeData(response.data);
        return JSON.stringify(zipCodeData, null, '\t'); //little pretty print magic
    }
}

let app = new Application();
let button: HTMLButtonElement = <HTMLButtonElement> document.getElementById('btn');
button.onclick = async () => {
    let zipCodeInputVal:string = (<HTMLInputElement> document.getElementById('zipcode')).value;
    let tag:HTMLDivElement = <HTMLDivElement> document.getElementById('result');
    let result: string = await app.fetchData(zipCodeInputVal);
    tag.innerHTML = "<pre>" + result.toString(); + "</pre>"
}