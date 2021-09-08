//import serialize from 'serialize-javascript';
import {assetUrl} from '/lib/xp/portal';

/*
<script crossorigin src="${assetUrl({path: 'js/react/react.development.js'})}"></script>
<script crossorigin src="${assetUrl({path: 'js/react-dom/react-dom.development.js'})}"></script>
*/

//const REACT_MODE = 'production.min';
const REACT_MODE = 'development';

export function get() {
	/*const props = {
		children: 'Hello'
	};*/
	return {
		body: `<html>
	<head>
	<script crossorigin src="https://unpkg.com/react@16.9.0/umd/react.${REACT_MODE}.js"></script>
	<script crossorigin src="https://unpkg.com/react-dom@16.9.0/umd/react-dom.${REACT_MODE}.js"></script>
    <link rel="stylesheet" type="text/css" href="${assetUrl({path: 'style.css'})}"/>
    <title>ECMAScript page with React</title>
  </head>
  <body>
    <form class="sass">
      <input placeholder="This text should be red"/>
    </form>
    <form class="stylus">
      <input placeholder="This text should be orange"/>
    </form>
    <form class="css">
      <input placeholder="This text should be green"/>
    </form>
    <form class="less">
      <input placeholder="This text should be blue"/>
    </form>
    <div id='react-container'></div>
	<!--script src="${assetUrl({path: 'js/react/Div.mjs'})}"></script-->
    <script type="module" defer>
      import {Div} from '${assetUrl({path: 'js/react/Div.mjs'})}';
	  //console.debug(window.MyLibrary);
	  const props = undefined;
      /*const props = {
		  style: {
			  color: 'red'
		  }
	  };*/
	  console.debug(props);
	  const children = ['hello'];
	  console.debug(children);
      ReactDOM.render(
        //React.createElement(window.MyLibrary.Div, [props], [...children]),
		React.createElement(Div, [props], [...children]),
        document.getElementById('react-container')
      );
    </script>
  </body>
</html>`
	};
}
/*
https://github.com/system-ui/theme-ui/issues/1097
import * as MyLibrary from '${assetUrl({path: 'js/react/Div.mjs'})}';
import LIB from '${assetUrl({path: 'js/react/Div.mjs'})}'; // Does not provide a default export
import {Div} from '${assetUrl({path: 'js/react/Div.mjs'})}'; // Does not provide an export named 'Div'
const propsObj = eval(${serialize(props)});
*/
