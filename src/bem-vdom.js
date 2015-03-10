import R from 'ramda';
import H from 'virtual-dom/h';
import {Set, Map, List} from 'immutable';

export class BEM {
    constructor (spec) {
        this.spec = spec;
    }

    _modify (prop, value) {
        return new this.constructor(R.assoc(prop, value, this.spec));
    }

    tag () {
        return this.spec.tag;
    }

    classes () {
        return this.spec.classes;
    }

    mods () {
        return this.spec.mods;
    }

    attrs () {
        return this.spec.attrs;
    }

    setTag (newTag) {
        return this._modify('tag', newTag);
    }

    addClass (klass) {
        return this._modify('classes', this.spec.classes.add(klass));
    }

    removeClass (klass) {
        return this._modify('classes', this.spec.classes.remove(klass));
    }

    setAttr (n, v) {
        return this._modify('attrs', this.spec.attrs.set(n, v));
    }

    removeAttr (attr) {
        return this._modify('attrs', this.spec.attrs.remove(attr));
    }

    setMod (mod, value) {
        return this._modify('mods', this.spec.mods.set(mod, value));
    }

    removeMod (mod) {
        return this._modify('mods', this.spec.mods.remove(mod));
    }

    setName (name) {
        return this._modify('name', name);
    }

    className (baseName) {
        return this.mods()
            .filter((v, k) => (R.type(v) === 'String' && v !== '') || v === true)
            .map((v, k) => v === true ? `${baseName}_${k}` : `${baseName}_${k}_${v}`)
            .toSet()
            .add(baseName)
            .union(this.spec.classes)
            .toArray()
            .join(' ');
    };

    vdom (parentName) {
        let className = this.className(this.baseName(parentName));
        let children = this.children().map(c =>
            R.is(BEM, c) ? c.vdom(parentName || this.spec.name) : c
        ).toArray();
        let attrs = this.attrs().set('className', className).toJS();
        
        return H(this.tag(), attrs, children);
    };

    children () {
        return this.spec.children;
    }
}

export class Block extends BEM {
    vdom () {
        return super.vdom();
    }

    baseName () {
        return this.spec.name;
    }
};

export class Element extends BEM {
    setBlockName (blockName) {
        return this._modify('blockName', blockName);
    }

    baseName (parentName) {
        return this.spec.blockName !== void 0 ?
            this.spec.blockName + '__' + this.spec.name :
            parentName + '__' + this.spec.name;
    }
};

export const b = function (name, opts, ...children) {
    let {mods, attrs, tag, classes} = parseOpts(opts);
    return new Block({name, mods, attrs, classes, tag, children: new List(R.flatten(children))});
};

export const qe = function (blockName, name, opts, ...children) {
    let {mods, attrs, tag, classes} = parseOpts(opts);
    return new Element({name, mods, attrs, classes, tag, children: new List(R.flatten(children))});
};

export const e = function (name, opts, ...children) {
    return qe(void 0, name, opts, children);
};

function parseOpts (opts) {
    let startsWith = pattern => str =>
        R.substringTo(pattern.length, str) === pattern;
    let _filter = (v, k) => startsWith('_')(k);
    let mods = new Map(R.pickBy(R.not(_filter), opts));
    let attrs = new Map(R.pipe(
            R.pickBy(_filter),
            R.omit(['_tag', '_className']),
            R.toPairs,
            R.map(([k, v]) => [R.substringFrom(1, k), v]),
            R.fromPairs)(opts));
    let tag = R.defaultTo('div', opts._tag);
    let classes = R.contains(opts._className, ['', void 0]) ?
        new Set() :
        new Set(opts._className.split(' '));
    
    return {
        mods, tag, classes, attrs
    };
}
