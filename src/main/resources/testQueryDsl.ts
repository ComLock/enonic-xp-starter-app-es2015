import {
	storage,
	toStr
} from '@enonic/js-utils/src';
//@ts-ignore
import {executeFunction} from '/lib/xp/task';
import {
	//get as getContext,
	run as runInContext
	//@ts-ignore
} from '/lib/xp/context';
//@ts-ignore
//import {getUser} from '/lib/xp/auth';
import {
	create as createRepo,
	//createBranch as createRepoBranch,
	delete as deleteRepo
	//@ts-ignore
} from '/lib/xp/repo';
//@ts-ignore
import {connect} from '/lib/xp/node';

const inQuery = storage.query.dsl.inQuery;
const like = storage.query.dsl.like;
const pathMatch = storage.query.dsl.pathMatch;
const range = storage.query.dsl.range;
const term = storage.query.dsl.term;


const contextToRunIn = {
	attributes: {},
	branch: 'master',
	principals: ['role:system.admin'],
	repository: 'system-repo',
	user: {
		login: 'su',
		idProvider: 'system'
	}
};
//log.info('contextToRunIn:%s', contextToRunIn);


export function testQueryDSL() {
	runInContext(contextToRunIn, () => {
		executeFunction({
			description: 'Test QueryDSL',
			func: () => {
				const repoId = 'com.enonic.tests';
				try {
					//const deleteRepoRes =
					deleteRepo(repoId);
					//log.info('deleteRepoRes:%s', deleteRepoRes);
				} catch (e) {
					log.error('e:%s', e);
				}

				//const createRepoRes =
				createRepo({
					id: repoId
				});
				//log.info('createRepoRes:%s', createRepoRes);

				const connection = connect({
					branch: 'master',
					repoId
				});

				const nodeA = connection.create({
					_name: 'a',
					myBoolean: true,
					myNumber: 3,
					myString: 'hello'
				});
				log.info('nodeA:%s', toStr(nodeA));

				const termQueryParams = {
					count: -1,
					//query: term('_name', 'a')
					query: term('myString', 'hello')
				}
				log.info('termQueryParams:%s', toStr(termQueryParams));
				const termQueryRes = connection.query(termQueryParams);
				log.info('termQueryRes:%s', toStr(termQueryRes));

				const inQueryParams = {
					count: -1,
					query: inQuery('myString', ['hello'])
				}
				log.info('inQueryParams:%s', toStr(inQueryParams));
				const inQueryRes = connection.query(inQueryParams);
				log.info('inQueryRes:%s', toStr(inQueryRes));

				const likeQueryParams = {
					count: -1,
					query: like('myString', '*ell*')
				}
				log.info('likeQueryParams:%s', toStr(likeQueryParams));
				const likeQueryRes = connection.query(likeQueryParams);
				log.info('likeQueryRes:%s', toStr(likeQueryRes));

				const rangeQueryParams = {
					count: -1,
					query: range('myString', {gt: 1})
				}
				log.info('rangeQueryParams:%s', toStr(rangeQueryParams));
				const rangeQueryRes = connection.query(rangeQueryParams);
				log.info('rangeQueryRes:%s', toStr(rangeQueryRes));

				const pathMatchQueryParams = {
					count: -1,
					query: pathMatch('_path', '/a')
				}
				log.info('pathMatchQueryParams:%s', toStr(pathMatchQueryParams));
				const pathMatchQueryRes = connection.query(pathMatchQueryParams);
				log.info('pathMatchQueryRes:%s', toStr(pathMatchQueryRes));
			} // func
		}); // executeFunction
	}); // runInContext
} // function testQueryDSL
