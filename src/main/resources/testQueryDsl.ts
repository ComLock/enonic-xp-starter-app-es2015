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
					myString: 'a'
				});
				log.info('nodeA:%s', toStr(nodeA));

				const termQueryParams = {
					count: -1,
					//query: term('_name', 'a')
					query: term('myString', 'a')
				}
				log.info('termQueryParams:%s', toStr(termQueryParams));
				const termQueryRes = connection.query(termQueryParams);
				log.info('termQueryRes:%s', toStr(termQueryRes));
			} // func
		}); // executeFunction
	}); // runInContext
} // function testQueryDSL
