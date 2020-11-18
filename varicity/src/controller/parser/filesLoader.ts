export class FilesLoader {
    private static json = undefined;

    private static getFileNameOnly(filePath: string) : string {
        return filePath.split('/').pop().split('.json').shift();
    }

    private static loadJson() : void {
        const requireContext = require.context('../../../symfinder_files', false, /\.json$/);
        FilesLoader.json = {};
        requireContext.keys().forEach((key) => {
            const obj = requireContext(key);
            const simpleKey = FilesLoader.getFileNameOnly(key);
            FilesLoader.json[simpleKey] = obj;
        });
        console.log('Loaded json files : ', FilesLoader.json);
    }

    public static loadDataFile(fileName: string) : any {
        if (FilesLoader.json === undefined) {
            FilesLoader.loadJson();
        }
        return FilesLoader.json[fileName];
    }
}