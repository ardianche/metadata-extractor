const ParserService = require('../services/ParserService');

const $parser = new ParserService();

describe('parser test suite', ()=>{
    it('should find the directory', async ()=>{
        let result = await  $parser.retrieveFolders('/Users/ardian/Desktop/rdf-files/cache/epub');
        expect(result).not.toHaveLength(0);
        expect(result).toMatch('Success');
    });
    
    it('should find the specific file',async () => {
        let result = await  $parser.retrieveFile('/Users/ardian/Desktop/rdf-files/cache/epub/1');
        expect(result).not.toBe(null);
        expect(result[0]).toMatch('rdf');
    });

    it('should read the file', async() => {
        let result = await  $parser.parseFile('/Users/ardian/Desktop/rdf-files/cache/epub/1/pg1.rdf');
        expect(result).not.toBe(null);
    });

    it('should parse the file', async() => {
        let file = await $parser.parseFile('/Users/ardian/Desktop/rdf-files/cache/epub/1/pg1.rdf'); 
        let parsedFile = await $parser.completeParse(file);

        expect(parsedFile).toEqual(
            expect.objectContaining({
                author: expect.anything(),
                id: expect.anything(),
                publisher: expect.anything(),
                title: expect.anything(),
                license: expect.anything(),
                subjects: expect.anything(),
                publicationDate: expect.anything(),
                rights: expect.anything(),
                language: expect.anything(),
            })
        );
    });
});