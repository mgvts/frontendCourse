export const NOMINATIVE = 1; // именительный
export const GENITIVE = 2; // родительный
export const DATIVE = 3; // дательный
export const ACCUSATIVE = 4; // винительный
export const INSTRUMENTAL = 5; // творительный
export const PREPOSITIONAL = 6; // предложный

export const MALE = 1;
export const FEMALE = 2;
export const ANDROGYNOUS = 4;


type declension = 1 | 2 | 3 | 4 | 5 | 6
type declensionOrStr = declension | string | null | undefined
type gender = 1 | 2 | 4
type genderOrStr = gender | string | null | undefined


type mod = string
type tag = string
type tagObject = {
    [key: tag]: boolean
}
type ruleSetArray = {
    exceptions?: rule[],
    suffixes?: rule[],
}
type ruleSet = {
    exceptions?: rule,
    suffixes?: rule,
}
type rule = {
    mods?: mod[],
    gender?: gender,
    test?: string[],
    tags?: string[],
    female?: string[],
    male?: string[]
    androgynous?: string[]
}
type matchFun = (_: string) => boolean

export function endsWith(str: string, search: string): boolean {
    const strLength = str.length;
    return str.substring(strLength - search.length, strLength) === search;
}

export function startsWith(str: string, search: string, pos: number = 0): boolean {
    return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
}

export function getGenderConst(key: genderOrStr): gender | null {
    switch (key) {
        case 'male':
        case MALE:
            return MALE;
        case 'female':
        case FEMALE:
            return FEMALE;
        case 'androgynous':
        case ANDROGYNOUS:
            return ANDROGYNOUS;
        default:
            return null;
    }
}

export function getGenderByRuleSet(name: string, ruleSet: ruleSet): gender | null {
    if (!name || !ruleSet) {
        return null;
    }
    const nameLower = name.toLowerCase();
    if (ruleSet.exceptions) {
        const gender = getGenderByRule(ruleSet.exceptions as rule, (some: string) => {
            if (startsWith(some, '-')) {
                return endsWith(nameLower, some.substr(1));
            }
            return some === nameLower;
        });
        if (gender) return gender;
    }
    return ruleSet.suffixes
        ? getGenderByRule(ruleSet.suffixes as rule, (some: string) => endsWith(nameLower, some))
        : null;
}

export function getGenderByRule(rules: rule, matchFn: matchFun): gender | null {
    const genders = Object.keys(rules).filter((genderKey: string) => {
        const array = rules[genderKey as keyof rule];
        return Array.isArray(array) && array.some(matchFn);
    });
    if (genders.length !== 1) {
        return null;
    }

    return getGenderConst(genders[0] as string);
}

export function inclineByRules(str: string,
                               declensionStr: declensionOrStr,
                               genderStr: genderOrStr,
                               ruleSet: ruleSetArray): string {
    const declension = getDeclensionConst(declensionStr);
    const gender = getGenderConst(genderStr);

    const parts = str.split('-');
    const result: string[] = [];

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i] as string;
        const isFirstWord = i === 0 && parts.length > 1;

        const rule = findRule(part, gender, ruleSet, {
            firstWord: isFirstWord,
        });

        if (rule) {
            result.push(applyRule(rule, part, declension));
        } else {
            result.push(part);
        }
    }
    return result.join('-');
}

export function findRule(str: string, gender: gender | null, ruleSet: ruleSetArray, tags: tagObject = {}): rule | null {
    if (!str) {
        return null;
    }
    const strLower = str.toLowerCase();

    const tagList: string[] = [];
    Object.keys(tags).forEach((key) => {
        if (tags[key]) {
            tagList.push(key);
        }
    });

    if (ruleSet.exceptions) {
        const rule = findExactRule(ruleSet.exceptions, gender, (some) => some === strLower, tagList);
        if (rule) return rule;
    }

    return ruleSet.suffixes
        ? findExactRule(ruleSet.suffixes, gender, (some) => endsWith(strLower, some), tagList)
        : null;
}

export function findExactRule(rules: rule[], gender: gender | null, matchFn: matchFun, tags: tag[] = []): rule | null {
    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i] as rule;

        if (rule.tags) {
            if (!rule.tags.find((t) => tags.indexOf(t) !== -1)) {
                continue;
            }
        }

        if (rule.gender !== ANDROGYNOUS && gender !== rule.gender) {
            continue;
        }

        if (rule.test) {
            for (let j = 0; j < rule.test.length; j++) {
                if (matchFn(rule.test[j] as string)) {
                    return rule;
                }
            }
        }
    }
    return null;
}

export function getModByIdx(mods: mod[] | undefined, i: number): mod {
    if (mods && mods.length >= i) {
        return mods[i] as mod;
    }
    return '.';
}

export function applyRule(rule: rule, str: string, declension: declension | null): string {
    let mod;
    switch (declension) {
        case NOMINATIVE:
            mod = '.';
            break;
        case GENITIVE:
            mod = getModByIdx(rule.mods, 0);
            break;
        case DATIVE:
            mod = getModByIdx(rule.mods, 1);
            break;
        case ACCUSATIVE:
            mod = getModByIdx(rule.mods, 2);
            break;
        case INSTRUMENTAL:
            mod = getModByIdx(rule.mods, 3);
            break;
        case PREPOSITIONAL:
            mod = getModByIdx(rule.mods, 4);
            break;
        default:
            mod = '.';
    }

    return applyMod(str, mod);
}

export function applyMod(str: string, mod: mod): string {
    for (let i = 0; i < mod.length; i++) {
        const chr = mod[i];
        switch (chr) {
            case '.':
                break;
            case '-':
                str = str.substr(0, str.length - 1);
                break;
            default:
                str += chr;
        }
    }
    return str;
}

export function getDeclensionConst(key: declensionOrStr): declension | null {
    switch (key) {
        case 'nominative':
        case NOMINATIVE:
            return NOMINATIVE;
        case 'genitive':
        case GENITIVE:
            return GENITIVE;
        case 'dative':
        case DATIVE:
            return DATIVE;
        case 'accusative':
        case ACCUSATIVE:
            return ACCUSATIVE;
        case 'instrumental':
        case INSTRUMENTAL:
            return INSTRUMENTAL;
        case 'prepositional':
        case PREPOSITIONAL:
            return PREPOSITIONAL;
        default:
            return null;
    }
}

export function getDeclensionStr(cnst: declensionOrStr): string | null {
    switch (cnst) {
        case 'nominative':
        case NOMINATIVE:
            return 'nominative';
        case 'genitive':
        case GENITIVE:
            return 'genitive';
        case 'dative':
        case DATIVE:
            return 'dative';
        case 'accusative':
        case ACCUSATIVE:
            return 'accusative';
        case 'instrumental':
        case INSTRUMENTAL:
            return 'instrumental';
        case 'prepositional':
        case PREPOSITIONAL:
            return 'prepositional';
        default:
            return null;
    }
}
