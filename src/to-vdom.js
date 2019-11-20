
const EMPTY_OBJ = {};

// deeply convert an XML DOM to VDOM
export default function toVdom(node, map, h, options) {
	walk.map = map;
	walk.h = h;
	walk.options = options || EMPTY_OBJ;
	return walk(node);
}

function walk(n, index, arr) {
	const { options, h, map } = walk;


	if (n.nodeType === 3) {
		let text = 'textContent' in n ? n.textContent : n.nodeValue || '';

		if (options.trim !== false) {
			let isFirstOrLast = index === 0 || index === arr.length - 1;

			// trim strings but don't entirely collapse whitespace
			if (text.match(/^[\s\n]+$/g) && options.trim !== 'all') {
				text = ' ';
			}
			else {
				text = text.replace(/(^[\s\n]+|[\s\n]+$)/g, options.trim === 'all' || isFirstOrLast ? '' : ' ');
			}
			// skip leading/trailing whitespace
			// if (!text || text===' ' && arr.length>1 && (index===0 || index===arr.length-1)) return null;
			if ((!text || text === ' ') && arr.length > 1 && isFirstOrLast) return null;
			// if (!text && arr.length>1 && (index===0 || index===arr.length-1)) return null;
			// if (!text || text===' ') return null;
		}
		return text;
	}
	if (n.nodeType !== 1) return null;
	let nodeName = String(n.nodeName).toLowerCase();
	// Do not allow script tags unless explicitly specified
	if (nodeName === 'script' && !options.allowScripts) return null;


	// eslint-disable-next-line no-prototype-builtins
	if (map && map.hasOwnProperty(nodeName)) {
		nodeName = map[nodeName];
	}


	let out = h(
		nodeName,
		getProps(n.attributes),
		walkChildren(n.childNodes)
	);

	return out;
}

function getProps(attrs) {
	let len = attrs && attrs.length;
	if (!len) return null;
	let props = {};
	for (let i = 0; i < len; i++) {
		let { name, value } = attrs[i];
		if (value === '') value = true;
		if (name.substring(0, 2) === 'on' && walk.options.allowEvents) {
			value = new Function(value); // eslint-disable-line no-new-func
		} else if ('class' === name) {
			name = 'className'
		} else if ('style' === name) {
			value = splitStyle(value)
		} else {
			name = toCamelCase(name)
		}
		props[name] = value;
	}
	return props;
}

function walkChildren(children) {
	let c = children && Array.prototype.map.call(children, walk).filter(exists);
	return c && c.length ? c : null;
}

let exists = x => x;


function toCamelCase(name) {
	return name.replace(/-(.)/g, (match, letter) => letter.toUpperCase());
}


function splitStyle(str = '') {
	const result = {}
	const attributes = str.split(';');

	for (var i = 0; i < attributes.length; i++) {
		var entry = attributes[i].split(':');
		result[toCamelCase(entry.splice(0, 1)[0])] = entry.join(':');
	}
	return result
}