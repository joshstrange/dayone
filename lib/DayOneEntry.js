var plist = require('plist');
var hat = require('hat');
var doPackage = require('../package.json');

function DayOneEntry() {
    this.activity = '';
    this.creationDate = new Date();
    this.creator = false;
    this.entryText = '';
    this.ignoreStepCount = true;
    this.location = {
        /*
        administrativeArea: '', //State Code
        country: '',
        latitude: XX.XXXXX,
        locality: '', //City
        longitude: -XX.XXXX,
        placeName: '', //Address
        region: {
            center: {
                latitude: XX.XXXXX,
                longitude: -XX.XXXX,
            },
            radius: XX.XXXXXX
        }


         */
    };
    this.starred = false;
    this.stepCount = 0;
    this.tags = [];
    this.timeZone = 'America/New_York';
    this.UUID = false;
    this.weather = {
        /*
        celsius: '15',
        description: 'Cloudy',
        fahrenheit: '59'
        iconName: 'cloudyn.png',
        pressureMB: 1012,
        relativeHumidity: 77,
        service: 'HAMweather',
        sunriseDate: '',
        sunsetDate: '',
        visibilityKM: 16.093440000000001,
        windBearing: 180,
        windChillCelsius: 15,
        windSpeedKPH: 24
         */
    };
    /*
        To Attach photos name the image to the same UUID
        as the post and put it in the "photos"
        (same directory as entries)
     */
}
DayOneEntry.prototype.dump = function() {
    for(attr in this)
    {
        console.log(attr+':'+(typeof this[attr]));
    }
};


DayOneEntry.prototype.toOutputFormat = function toOutputFormat() {
    if(!this.UUID) {
        this.UUID = hat().toUpperCase();
    }

    if(!this.creator)
    {
        this.creator = {
            deviceAgent: 'nodeJS/dayOne',
            generationDate: new Date(),
            hostName: 'dayone nodeJS module',
            OSAgent: 'node/'+process.version,
            softwareAgent: 'dayone node/'+doPackage.version
        };
    }

    var prep = function(obj) {
        var plistMap = {
            OSAgent: 'OS Agent',
            UUID: 'UUID',
            pressureMB: 'Pressure MB',
            visibilityKM: 'Visibility KM',
            windSpeedKPH: 'Wind Speed KPH'
        };
        var entry = {};
        for(attr in obj)
        {
            if(typeof obj[attr] != 'function')
            {
                var key = attr.split(/(?=[A-Z])/).map(function(a){
                    return a.charAt(0).toUpperCase() + a.slice(1);
                }).join(' ');
                if(plistMap[attr])
                {
                    key = plistMap[attr];
                }
                var value = obj[attr];
                if(typeof value === 'object')
                {
                    if(typeof value.getMonth === 'function')
                    {
                        entry[key] = value;
                    }
                    else if(Object.keys(value).length)
                    {
                        entry[key] = prep(value);
                    }
                }
                else if(value != false)
                {
                    entry[key] = value;
                }
            }
        }
        return entry;
    };
    var entry = prep(this);
    return plist.build(entry);
}

DayOneEntry.prototype.extend = function(x) {
   for(i in x)
   {
      this[i] = x[i];
   }
};

DayOneEntry.prototype.fromFile = function fromOutputFormat(filename) {
    var entry = plist.parseFileSync(filename);

    if(!entry) {
        return null;
    }

    var unPrep = function(obj) {
        var plistMap = {
            'OS Agent': 'OSAgent',
            'UUID': 'UUID',
            'Pressure MB': 'pressureMB',
            'Visibility KM': 'visibilityKM',
            'Wind Speed KPH': 'windSpeedKPH'
        };
        var entry = {};
        for(attr in obj)
        {
            var key = attr.split(' ').join('');
            key = key.charAt(0).toLowerCase()+key.slice(1);
            if(plistMap[attr])
            {
                key = plistMap[attr];
            }
            var value = obj[attr];
            if(typeof value === 'object')
            {
                if(key.indexOf('Date') != -1)
                {
                    entry[key] = new Date(value);
                }
                else
                {
                    entry[key] = unPrep(value);
                }
            }
            else
            {
                entry[key] = value;
            }
        }
        return entry;
    };

    var data = unPrep(entry);
    this.extend(data);
    return this;
}

exports.DayOneEntry = DayOneEntry;
