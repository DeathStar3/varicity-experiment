export class ConfigLoader {
    private static json = undefined;

    private static getConfigNameOnly(configPath: string) : string {
        return configPath.split('/').pop().split(/\.ya?ml$/).shift();
    }

    private static loadJson() : void {
        const requireContext = require.context('../../../config', false, /\.ya?ml$/);
        ConfigLoader.json = {};
        requireContext.keys().forEach((key) => {
            const obj = requireContext(key);
            const simpleKey = ConfigLoader.getConfigNameOnly(key);
            ConfigLoader.json[simpleKey] = obj;
        });
        // ConfigLoader.json = YAML.parseDocument(fileName)
        console.log('Loaded yaml files : ', ConfigLoader.json);
    }

    public static loadDataFile(fileName: string) : any {
        if (ConfigLoader.json === undefined) {
            ConfigLoader.loadJson();
        }
        return ConfigLoader.json[fileName];
    }
}