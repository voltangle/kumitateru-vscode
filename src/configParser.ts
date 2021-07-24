import * as bombadil from '@sgarciac/bombadil';
import * as fs from 'fs';

export function getParsedConfig(path: string) {
    let rawConfig = fs.readFileSync(path, 'utf-8');
    let reader = new bombadil.TomlReader;
    reader.readToml(rawConfig);
    return reader.result;
}