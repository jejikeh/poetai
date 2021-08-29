
import { useEffect,useState,useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, highlightActiveLine} from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { history,historyKeymap} from '@codemirror/history';
import { indentOnInput /*syntaxTree */ } from '@codemirror/language';
import { bracketMatching } from '@codemirror/matchbrackets';
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/gutter';
import { defaultHighlightStyle, HighlightStyle, tags } from '@codemirror/highlight';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages  } from '@codemirror/language-data';
//import { oneDark } from '@codemirror/theme-one-dark';
//import { javascript } from '@codemirror/lang-javascript';



const cursor = '#E53525 !important';
const darkBackground = '#E53525 !important';
const ivory = '#E53525 !important';
const selection = '#19E5C5 !important';
const highlightBackground = '#FFFFFF !important';
const background = '#FFFFFF !important';
const stone = '#C8BFBF !important';
const backgroundColor = '#FFFFFF !important';
const color = '#26292A !important';
const caretColor = '#26292A !important';
const searchMatch= '#26292A !important';
const searchMatchSelected= '#26292A !important';

const foldPlaceholder = '#26292A !important';
const selectionMatch = '#26292A !important';
const nonmatchingBractet = null;
const activeLineGutter = '#26292A !important';


export const transparrentTheme  = EditorView.theme({
    '&': {
        backgroundColor: backgroundColor,
        color : color,
    },
    '.cm-content': {
        caretColor : caretColor,
    },
    '&.cm-focused .cm-cursor': { 
        borderLeftColor: cursor, 
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': { backgroundColor: selection },
    '.cm-panels': { backgroundColor: darkBackground, color: ivory },
    '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
    '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },
    '.cm-searchMatch': {
        backgroundColor: searchMatch,
        outline: '2px solid #457dff',
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
        backgroundColor: searchMatchSelected,
    },
    '.cm-activeLine': { backgroundColor: highlightBackground },
    '.cm-selectionMatch': { backgroundColor: selectionMatch },
    '.cm-matchingBracket, .cm-nonmatchingBracket': {
        backgroundColor: nonmatchingBractet,
        outline: '1px solid #515a6b',
    },
    '.cm-gutters': {
        backgroundColor: background,
        color: stone,
        border: '2px solid #26292A',
    },
    '.cm-activeLineGutter': {
        backgroundColor: activeLineGutter,
    },
    '.cm-foldPlaceholder': {
        backgroundColor: 'transparent',
        border: 'none',
        color: foldPlaceholder,
    },
    '.cm-tooltip': {
        border: '3px solid #181a1f',
        backgroundColor: darkBackground,
    },
    '.cm-tooltip-autocomplete': {
        '& > ul > li[aria-selected]': {
            backgroundColor: highlightBackground,
            color: ivory,
        },
    },
});

const violet = '#26292A !important';
const coral = '#26292A !important';
const malibu = '#19E5C5 !important';
const whiskey = '#19E5C5 !important';
const chalky = '#807D7E !important';
const cyan = '#616061 !important';
const sage  = '#616061 !important';
const invalid = '#26292A !important';

const head1 = '#26292A !important';
const head2 = '#616061 !important';
const head3 = '#807D7E !important';
const head4 = '#9E999A !important';
const head5 = '#C8BFBF !important';

const syntaxHighlighting = HighlightStyle.define([
    { tag: tags.keyword,
        color: violet },
    { tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName],
        color: coral },
    { tag: [/*@__PURE__*/tags.function(tags.variableName), tags.labelName],
        color: malibu },
    { tag: [tags.color, /*@__PURE__*/tags.constant(tags.name), /*@__PURE__*/tags.standard(tags.name)],
        color: whiskey },
    { tag: [/*@__PURE__*/tags.definition(tags.name), tags.separator],
        color: ivory },
    { tag: [tags.typeName, tags.className, tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace],
        color: chalky },
    { tag: [tags.operator, tags.operatorKeyword, tags.url, tags.escape, tags.regexp, tags.link, /*@__PURE__*/tags.special(tags.string)],
        color: cyan },
    { tag: [tags.meta, tags.comment],
        color: stone },
    { tag: tags.strong,
        fontWeight: 'bold' },
    { tag: tags.emphasis,
        fontStyle: 'italic' },
    { tag: tags.strikethrough,
        textDecoration: 'line-through' },
    { tag: tags.link,
        color: stone,
        textDecoration: 'underline' },
    { tag: tags.heading,
        fontWeight: 'bold',
        color: coral },
    { tag: [tags.atom, tags.bool, /*@__PURE__*/tags.special(tags.variableName)],
        color: whiskey },
    { tag: [tags.processingInstruction, tags.string, tags.inserted],
        color: sage },
    { tag: tags.invalid,
        color: invalid },
    {
        tag: tags.heading1,
        fontSize : '1.8em',
        fontWeight : 'bold',
        color : head1,
    },
    { 
        tag: tags.heading2,
        fontSize : '1.6em',
        fontWeight : 'bold',
        color : head2,
    },
    {
        tag: tags.heading3,
        fontSize : '1.4em',
        fontWeight : 'bold',
        color : head3,
    },
    {
        tag: tags.heading4,
        fontSize : '1.2em',
        fontWeight : 'bold',
        color : head4,
    },
    {
        tag : tags.heading5,
        fontSize : '1em',
        fontWeight : 'bold',
        color : head5,
    },
    {
        tag: tags.heading6,
        fontSize : '0.8em',
        fontWeight : 'bold',
        color : head5,
    },
]);


import type React from 'react';

interface Props {
    initialDoc : string;
    onChange? : ( state : EditorState ) => void 
}

const useCodeMirror = <T extends Element>(
    props : Props,
):[React.MutableRefObject<T | null>, EditorView?] => {
    const refContainer = useRef<T>(null);
    const [ editorView, setEditorView ] = useState<EditorView>();
    const { onChange } = props;

    useEffect(() => {
        if(!refContainer.current) return;

        const startState = EditorState.create({
            doc : props.initialDoc,
            extensions : [
                keymap.of([... defaultKeymap, ... historyKeymap]),
                lineNumbers(),
                highlightActiveLineGutter(),
                history(),
                indentOnInput(),
                bracketMatching(),
                defaultHighlightStyle.fallback,
                highlightActiveLine(),
                markdown({
                    base : markdownLanguage,
                    codeLanguages : languages,
                    addKeymap : true,
                }),
                transparrentTheme,
                syntaxHighlighting,
                EditorView.lineWrapping,
                EditorView.updateListener.of(update => {
                    if (update.changes) {
                        onChange && onChange(update.state);
                    }
                }),
            ],
        });

        const view = new EditorView({
            state : startState,
            parent : refContainer.current,
        });

        setEditorView(view);
    },[refContainer]);

    return [refContainer, editorView];
};

export default useCodeMirror;