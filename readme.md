<!-- markdownlint-disable MD004 MD007 MD010 MD041 MD022 MD024 MD032 -->
# browse

*because it should not be so complicated* -
***run code in browser with watch mode and reload***

• [Why](#why) • [How](#how) • [License](#license) •

# Why

* need to just run a file in browser with no side effects (cache and temp files)
* *Parcel CLI* always creates `.parcel-cache` folders, even with `--no-cache`
* *Vite CLI* creates `.parcel-cache` folders
* *Snowpack CLI* serves a whole folder

## How

### Global

Once: `npm i -g @hugov/browse`
Anywhere: `browse pathToMyScript.js`

### Local

Once: `npm i -D @hugov/browse`
Anywhere: `npx browse pathToMyScript.js`

### Limitations

* Only chrome (uses Chrom Launcher and flags)
* no html entry for now (script/modules only)

# License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
