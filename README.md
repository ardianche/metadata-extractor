# metadata-extractor


## Requirements

- ~~Write a function that reads a single file in and outputs the correct output, using something like ​[xml2js](https://www.npmjs.com/package/xml2js) ​ or [xmldom](https://www.npmjs.com/package/xmldom) ​will probably be useful to read the rdf files ~~

- ~~Store the output in a database of your choice locally for later querying, perhaps something like ​[sequelize](https://github.com/sequelize/sequelize​) with MySQL/PostGreSQL or use something else! ~~

- ~~Write unit tests in a testing framework like mocha or jest for the code, ensuring that coverage information is saved ~~

    > Worth noting that due to a setback with my current laptop, not all files are being processed because there is an open file limit set to 256. 

- ~~Run the function against all the rdf files ~~
    > It iterates every subdirectory and file but some may end in error due to open-file limitation
- Send through the code once you're done, ensuring that if you create a github repo the name is simply your name concatenated with "example-code" if using with your test coverage analysis file