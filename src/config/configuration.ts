import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const APPLICATION_CONFIG_FILENAME = 'configuration.yaml';

const yamlConfig = (filename: string) =>
  yaml.load(readFileSync(join(__dirname, filename), 'utf8')) as Record<
    string,
    any
  >;

// configurations aqui
export const applicationConfig = () => yamlConfig(APPLICATION_CONFIG_FILENAME);
