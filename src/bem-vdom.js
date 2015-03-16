import H from 'virtual-dom/h';

const modDelimiter = '_';
const elDelimiter = '__';

const bemClasses = function bemClasses (baseName, mods) {
    let modClasses = Object.keys(mods)
        .filter(function (key) {
            return (typeof mods[key] === "boolean" && mods[key] === true) ||
                   (typeof mods[key] === 'string' && mods[key].length !== 0);
        })
        .map(function (key) {
            if (mods[key] === true) {
                return baseName + modDelimiter + key;
            } else {
                return [baseName, key, mods[key]].join(modDelimiter);
            }
        });
    modClasses.unshift(baseName);
    return modClasses;
};

const flatten = function flatten (xs) {
    return Array.prototype.concat.apply([], xs);
};

export class BEM {
    constructor (spec) {
        this.spec = spec;
    }

    name () {
        return this.spec.name;
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
        this.spec.tag = newTag;
        return this;
    }

    addClass (klass) {
        this.spec.classes.push(klass);
        return this;
    }

    removeClass (klass) {
        let i = this.spec.classes.indexOf(klass);
        if (i !== -1) {
            this.spec.classes.splice(i, 1);
        }
        return this;
    }

    setAttr (n, v) {
        this.spec.attrs[n] = v;
        return this;
    }

    removeAttr (attr) {
        delete this.spec.attrs[attr];
        return this;
    }

    setMod (mod, value) {
        this.spec.mods[mod] = value;
        return this;
    }

    removeMod (mod) {
        delete this.spec.mods[mod];
        return this;
    }

    setName (name) {
        this.spec.name = name;
        return this;
    }

    className (baseName) {
        return this.spec.classes.concat(bemClasses(baseName, this.spec.mods)).join(' ');
    }

    vdom (parentName) {
        let className = this.className(this.baseName(parentName));
        let children = this.children().map(c =>
            c instanceof BEM ? c.vdom(parentName || this.name()) : c
        );
        let attrs = {className};
        Object.keys(this.attrs()).forEach((key) => attrs[key] = this.attrs()[key]);
        
        return H(this.tag(), attrs, children);
    }

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
}

export class Element extends BEM {
    setBlockName (blockName) {
        this.spec.blockName = blockName;
        return this;
    }

    baseName (parentName) {
        return this.spec.blockName !== void 0 ?
            this.spec.blockName + elDelimiter + this.spec.name :
            parentName + elDelimiter + this.spec.name;
    }
}

export const b = function (name, opts, ...children) {
    let {mods, attrs, tag, classes} = parseOpts(opts);
    return new Block({name, mods, attrs, classes, tag, children: flatten(children)});
};

export const qe = function (blockName, name, opts, ...children) {
    let {mods, attrs, tag, classes} = parseOpts(opts);
    return new Element({name, mods, attrs, classes, tag, children: flatten(children)});
};

export const e = function (name, opts, ...children) {
    return qe(void 0, name, opts, children);
};

function parseOpts (opts) {
    let mods = {};
    let attrs = {};
    let tag = 'div';
    let classes = [];
    
    Object.keys(opts).forEach(function (key) {
        if (key[0] === '_') {
            if (key === '_tag') {
                tag = opts[key];
            } else if (key === '_className' && opts[key].length > 0) {
                classes = opts[key].split(' ');
            } else {
                attrs[key.substr(1)] = opts[key];
            }
        } else {
            mods[key] = opts[key];
        }
    });

    return {
        mods, tag, classes, attrs
    };
}
