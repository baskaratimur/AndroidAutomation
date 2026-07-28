import * as fs from 'fs';
import * as path from 'path';

const stateFile = path.resolve(process.cwd(), '.test-state.json');

export const GlobalState: any = new Proxy({}, {
    get(_target, prop: string) {
        if (fs.existsSync(stateFile)) {
            const data = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
            return data[prop];
        }
        return undefined;
    },
    set(_target, prop: string, value: any) {
        let data: any = {};
        if (fs.existsSync(stateFile)) {
            data = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
        }
        data[prop] = value;
        fs.writeFileSync(stateFile, JSON.stringify(data, null, 2));
        return true;
    }
});
