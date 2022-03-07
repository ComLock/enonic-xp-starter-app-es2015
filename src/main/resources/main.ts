import '@enonic/nashorn-polyfills';
import {
	getIn,
	setIn
} from '@enonic/js-utils/src';

log.info('Hello');

const text = 'code';
log.info(`Hi from transpiled ${text} :)`);

const obj = {
	a: 'a',
	b: 'b'
};
log.info(`obj:${JSON.stringify(obj)}`);

const copy = {...obj};
log.info(`copy:${JSON.stringify(copy)}`);

const {a, ...rest} = obj;
log.info(`rest:${JSON.stringify(rest)}`);

/*
The find() method returns the value of the first element in
the provided array that satisfies the provided testing function.
If no values satisfies the testing function, undefined is returned.
*/
const array1 = [5, 12, 8, 130, 44];
log.info(`array.find:${JSON.stringify(
	array1.find((element) => element > 10)
)}`);

setIn(obj, 'nested.twice', 'value');
log.info(`obj:${JSON.stringify(obj)}`);
log.info(`nested.twice:${JSON.stringify(
	getIn(obj, 'nested.twice')
)}`);
