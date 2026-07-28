/*
Copyright (c) 2015, Luís Rodrigues

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

function Token(string) {
    this.vowels = ''
    this.regions = {}
    this.string = string
    this.original = string
}

Token.prototype.replaceSuffixInRegion = function (suffix, replace, region) {
    const suffixes = [].concat(suffix)
    for (let i = 0; i < suffixes.length; i++) {
        if (this.hasSuffixInRegion(suffixes[i], region)) {
            this.string = this.string.slice(0, -suffixes[i].length) + replace
            return this
        }
    }
    return this
}

Token.prototype.usingVowels = function (vowels) {
    this.vowels = vowels
    return this
}

Token.prototype.markRegion = function (region, args, callback, context) {
    if (typeof callback === 'function') {
        // this.regions[region] = callback.apply(context || this, [].concat(args))
        this.regions[region] = callback.apply(context || this, [].concat(args))
    } else if (!isNaN(args)) {
        this.regions[region] = args
    }

    return this
}
Token.prototype.replaceAll = function (find, replace) {
    this.string = this.string.split(find).join(replace)
    return this
}

Token.prototype.hasVowelAtIndex = function (index) {
    return this.vowels.indexOf(this.string[index]) !== -1
}

Token.prototype.hasSuffix = function (suffix) {
    return this.string.slice(-suffix.length) === suffix
}

Token.prototype.hasSuffixInRegion = function (suffix, region) {
    const regionStart = this.regions[region] || 0
    const suffixStart = this.string.length - suffix.length
    return this.hasSuffix(suffix) && suffixStart >= regionStart
}

// token

function prelude(token) {
    return token
        .replaceAll('ã', 'a~')
        .replaceAll('õ', 'o~')
}

function verbSuffix(token) {
    token.replaceSuffixInRegion([
        'aríamos', 'ássemos', 'eríamos', 'êssemos', 'iríamos', 'íssemos',

        'áramos', 'aremos', 'aríeis', 'ásseis', 'ávamos', 'éramos', 'eremos',
        'eríeis', 'ésseis', 'íramos', 'iremos', 'iríeis', 'ísseis',

        'ara~o', 'ardes', 'areis', 'áreis', 'ariam', 'arias', 'armos', 'assem',
        'asses', 'astes', 'áveis', 'era~o', 'erdes', 'ereis', 'éreis', 'eriam',
        'erias', 'ermos', 'essem', 'esses', 'estes', 'íamos', 'ira~o', 'irdes',
        'ireis', 'íreis', 'iriam', 'irias', 'irmos', 'issem', 'isses', 'istes',

        'adas', 'ados', 'amos', 'ámos', 'ando', 'aram', 'aras', 'arás', 'arei',
        'arem', 'ares', 'aria', 'asse', 'aste', 'avam', 'avas', 'emos', 'endo',
        'eram', 'eras', 'erás', 'erei', 'erem', 'eres', 'eria', 'esse', 'este',
        'idas', 'idos', 'íeis', 'imos', 'indo', 'iram', 'iras', 'irás', 'irei',
        'irem', 'ires', 'iria', 'isse', 'iste',

        'ada', 'ado', 'ais', 'ara', 'ará', 'ava', 'eis', 'era', 'erá', 'iam',
        'ias', 'ida', 'ido', 'ira', 'irá',

        'am', 'ar', 'as', 'ei', 'em', 'er', 'es', 'eu', 'ia', 'ir', 'is', 'iu', 'ou'

    ], '', 'rv')

    return token
}

function standardSuffix(token) {
    token.replaceSuffixInRegion([
        'amentos', 'imentos', 'aço~es', 'adoras', 'adores', 'amento', 'imento',

        'aça~o', 'adora', 'ância', 'antes', 'ismos', 'istas',

        'ador', 'ante', 'ável', 'ezas', 'icas', 'icos', 'ismo', 'ista', 'ível',
        'osas', 'osos',

        'eza', 'ica', 'ico', 'osa', 'oso'

    ], '', 'r2')

    token.replaceSuffixInRegion(['logias', 'logia'], 'log', 'r2')

    // token.replaceSuffixInRegion(['uço~es', 'uça~o'], 'u', 'r1');

    token.replaceSuffixInRegion(['ências', 'ência'], 'ente', 'r2')

    token.replaceSuffixInRegion([
        'ativamente', 'icamente', 'ivamente', 'osamente', 'adamente'
    ], '', 'r2')

    token.replaceSuffixInRegion('amente', '', 'r1')

    token.replaceSuffixInRegion([
        'antemente', 'avelmente', 'ivelmente', 'mente'
    ], '', 'r2')

    token.replaceSuffixInRegion([
        'abilidades', 'abilidade',
        'icidades', 'icidade',
        'ividades', 'ividade',
        'idades', 'idade'
    ], '', 'r2')

    token.replaceSuffixInRegion([
        'ativas', 'ativos', 'ativa', 'ativo',
        'ivas', 'ivos', 'iva', 'ivo'
    ], '', 'r2')

    if (token.hasSuffix('eiras') || token.hasSuffix('eira')) {
        token.replaceSuffixInRegion(['iras', 'ira'], 'ir', 'rv')
    }

    return token
}

function iPrecededByCSuffix(token) {
    if (token.hasSuffix('ci')) {
        token.replaceSuffixInRegion('i', '', 'rv')
    }

    return token
}

function residualSuffix(token) {
    token.replaceSuffixInRegion(['os', 'a', 'i', 'o', 'á', 'í', 'ó'], '', 'rv')

    return token
}

function residualForm(token) {
    const tokenString = token.string

    if (token.hasSuffix('gue') || token.hasSuffix('gué') || token.hasSuffix('guê')) {
        token.replaceSuffixInRegion(['ue', 'ué', 'uê'], '', 'rv')
    }

    if (token.hasSuffix('cie') || token.hasSuffix('cié') || token.hasSuffix('ciê')) {
        token.replaceSuffixInRegion(['ie', 'ié', 'iê'], '', 'rv')
    }

    if (tokenString === token.string) {
        token.replaceSuffixInRegion(['e', 'é', 'ê'], '', 'rv')
    }

    token.replaceSuffixInRegion('ç', 'c', 'all')

    return token
}

function postlude(token) {
    return token
        .replaceAll('a~', 'ã')
        .replaceAll('o~', 'õ')
}

const markRegionN = function (start) {
    let index = start || 0
    const length = this.string.length
    let region = length

    while (index < length - 1 && region === length) {
        if (this.hasVowelAtIndex(index) && !this.hasVowelAtIndex(index + 1)) {
            region = index + 2
        }
        index++
    }

    return region
}

Token.prototype.hasVowelAtIndex = function (index) {
    return this.vowels.indexOf(this.string[index]) !== -1
}

Token.prototype.nextVowelIndex = function (start) {
    let index = (start >= 0 && start < this.string.length) ? start : this.string.length
    while (index < this.string.length && !this.hasVowelAtIndex(index)) {
        index++
    }
    return index
}

Token.prototype.nextConsonantIndex = function (start) {
    let index = (start >= 0 && start < this.string.length) ? start : this.string.length
    while (index < this.string.length && this.hasVowelAtIndex(index)) {
        index++
    }
    return index
}

const markRegionV = function () {
    let rv = this.string.length

    if (rv > 3) {
        if (!this.hasVowelAtIndex(1)) {
            rv = this.nextVowelIndex(2) + 1
        } else if (this.hasVowelAtIndex(0) && this.hasVowelAtIndex(1)) {
            rv = this.nextConsonantIndex(2) + 1
        } else {
            rv = 3
        }
    }

    return rv
}

function stemmer(word) {
    let token = new Token(word.toLowerCase())

    token = prelude(token)

    token.usingVowels('aeiouáéíóúâêôàãõ')
        .markRegion('all', 0)
        .markRegion('r1', null, markRegionN)
        .markRegion('r2', token.regions.r1, markRegionN)
        .markRegion('rv', null, markRegionV)

    const original = token.string

    // Always do step 1.
    token = standardSuffix(token)

    // Do step 2 if no ending was removed by step 1.
    if (token.string === original) {
        token = verbSuffix(token)
    }

    // If the last step to be obeyed — either step 1 or 2 — altered the word,
    // do step 3. Alternatively, if neither steps 1 nor 2 altered the word, do
    // step 4.
    token = token.string !== original ? iPrecededByCSuffix(token) : residualSuffix(token)

    // Always do step 5.
    token = residualForm(token)

    token = postlude(token)

    return token.string
}

module.exports = stemmer;