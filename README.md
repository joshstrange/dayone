# dayone

NodeJS Module to create, list and remove [Day One](http://dayoneapp.com/) Journal entries, without using the [Day One command line tools](http://dayoneapp.com/tools/).


NOTE: Forked from [https://github.com/pwaldhauer/dayone](https://github.com/pwaldhauer/dayone) so that I could update it to work with the new Day One file format. There are few "breaking" changes due to some restructuring but by and large it should work the same.

Differences:

Old
```javascript
entry.text = 'Blah';
```

New
```javascript
entry.entryText = 'Blah';
```

AND

Old
```javascript
entry.location = {
	'Gross Spaces': 'Blah'
};
```

New
```javascript
entry.location = {
	noGrossSpaces: 'Blah'
};
```

Both changes were made to make the module more adaptable to future format changes and to avoid mixing camelCased code with key's that have spaces (What the plist file uses for it's keys).


## Usage

```javascript
var DayOne = require('dayone').DayOne;
var DayOneEntry = require('dayone').DayOneEntry;

// Basic entry
var entry = new DayOneEntry();
entry.creationDate = new Date();
entry.entryText = 'Very thoughtful entry!';
entry.tags = ['Test'];

var dayone = new DayOne();

dayone.save(entry, function(error) {
    console.log('Saved!');
})
```

Optionally `DayOne()` accepts an object containing a `directory` that should point to the Day One Journal directory. If omitted it will use the iCloud documents directory by default. If it doesn't find the iCloud directory, it will use the Dropbox Application directory.

For more usage examples take a look at the tests or [Elizabeth](https://github.com/pwaldhauer/elizabeth), my script to export your Moves.app data, which uses this module. Surprise!

## Methods

### DayOne#list(options, cb)

Lists all entries in the journal. List may be filtered by tags by passing in `{"tags": ["Tags", "to", "filter", "by"]}` as options. The callback should be a `function(err, entries) {}`.

### DayOne#save(entry, cb)

Saves the given `DayOneEntry`. The callback should be a `function(err) {}`.

### DayOne#remove(uuid, cb)

Removes the entry. The callback should be a `function(err) {}`.

### DayOneEntry

Basically an object with the following fields: `creationDate` (Date), `text` (String), `tags` (Array), `timezone` (String), `starred` (Bool), `UUID` (String), `photo` (Buffer). If the `UUID` is not defined it will be automatically created.

## Contribute

Feel free to contribute! :)
