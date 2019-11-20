import parseMarkup from './parse-markup';
import toVdom from './to-vdom';



/** Convert markup into a virtual DOM.
*	@param {String} markup		HTML or XML markup (indicate via `type`)
*	@param {String} [type=xml]	A type to use when parsing `markup`. Either `xml` or `html`.
*	@param {Function} reviver	The JSX/hyperscript reviver (`h` function) to use. For example, Preact's `h` or `ReactDOM.createElement`.
*	@param {Object} [map]		Optional map of custom element names to Components or variant element names.
 */
export default function markupToVdom(markup, type, reviver, map, options) {
	let dom = parseMarkup(markup, type);

	if (dom && dom.error) {
		throw new Error(dom.error);
	}
	
	let body = dom && dom.body || dom;

	let vdom = body && toVdom(body, map, reviver, options);
	map = null;
	return vdom && vdom.props && vdom.props.children || null;
}


