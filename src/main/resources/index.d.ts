import {
	App,
	Log
} from './types/index.d';

/*export {
	App,
	Application,
	Log
} from './types/index.d';*/


// Global-modifying module, should be placed in moduleRoot/index.d.ts
declare global {
	const app :App;
	const log :Log;
}
