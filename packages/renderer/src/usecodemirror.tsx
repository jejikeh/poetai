import { useEffect,useState,useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, highlightActiveLine} from '@codemirror/view'
import { defaultKeymap } from "@codemirror/commands";
import { history,historyKeymap} from "@codemirror/history";
import { indentOnInput, syntaxTree } from "@codemirror/language";
import { bracketMatching } from "@codemirror/matchbrackets";
import { lineNumbers, highlightActiveLineGutter } from "@codemirror/gutter";
import { defaultHighlightStyle, HighlightStyle, tags } from "@codemirror/highlight";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages  } from "@codemirror/language-data";
import { oneDark } from "@codemirror/theme-one-dark";
import { javascript } from "@codemirror/lang-javascript";



const cursor = '#ffff'
const darkBackground = "#ffff"
const ivory = "#fffff"
const selection = "#fffff"
const highlightBackground = "#FFFFFF"
const background = "#FFFFF"
const stone = "#FLE"
const backgroundColor = null
const color = null
const caretColor = null
const searchMatch= null
const foldPlaceholder = null
const selectionMatch = null
const nonmatchingBractet = null
const activeLineGutter = null


export const transparrentTheme  = EditorView.theme({
    '&': {
        backgroundColor: backgroundColor,
        color : color,
        height: '1000%'
    },
    ".cm-content": {
        caretColor : caretColor
    },
    "&.cm-focused .cm-cursor": { 
        borderLeftColor: cursor 
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection": { backgroundColor: selection },
    ".cm-panels": { backgroundColor: darkBackground, color: ivory },
    ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
    ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },
    ".cm-searchMatch": {
        backgroundColor: "#72a1ff59",
        outline: "1px solid #457dff"
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
        backgroundColor: searchMatch
    },
    ".cm-activeLine": { backgroundColor: highlightBackground },
    ".cm-selectionMatch": { backgroundColor: selectionMatch },
    ".cm-matchingBracket, .cm-nonmatchingBracket": {
        backgroundColor: nonmatchingBractet,
        outline: "1px solid #515a6b"
    },
    ".cm-gutters": {
        backgroundColor: background,
        color: stone,
        border: "none"
    },
    ".cm-activeLineGutter": {
        backgroundColor: activeLineGutter,
    },
    ".cm-foldPlaceholder": {
        backgroundColor: "transparent",
        border: "none",
        color: foldPlaceholder
    },
    ".cm-tooltip": {
        border: "1px solid #181a1f",
        backgroundColor: darkBackground
    },
    ".cm-tooltip-autocomplete": {
        "& > ul > li[aria-selected]": {
            backgroundColor: highlightBackground,
            color: ivory
        }
    }
})

const violet = null
const coral = null
const malibu = null
const whiskey = null
const chalky = null
const cyan = null
const sage  = null
const invalid = null

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
        fontWeight: "bold" },
    { tag: tags.emphasis,
        fontStyle: "italic" },
    { tag: tags.strikethrough,
        textDecoration: "line-through" },
    { tag: tags.link,
        color: stone,
        textDecoration: "underline" },
    { tag: tags.heading,
        fontWeight: "bold",
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
        fontWeight : 'bold'
    },
    { 
        tag: tags.heading2,
        fontSize : '1.6em',
        fontWeight : 'bold'
    },
    {
        tag: tags.heading3,
        fontSize : '1.4em',
        fontWeight : "bold"
    },
    {
        tag: tags.heading4,
        fontSize : "1.2em",
        fontWeight : "bold"
    },
    {
        tag : tags.heading5,
        fontSize : "1em",
        fontWeight : "bold",
    },
    {
        tag: tags.heading6,
        fontSize : "0.8em",
        fontWeight : "bold"
    }
])


import type React from 'react';

interface Props {
    initialDoc : string;
    onChange? : ( state : EditorState ) => void 
}

const useCodeMirror = <T extends Element>(
    props : Props
):[React.MutableRefObject<T | null>, EditorView?] => {
    const refContainer = useRef<T>(null)
    const [ editorView, setEditorView ] = useState<EditorView>()
    const { onChange } = props

    useEffect(() => {
        if(!refContainer.current) return

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
                    addKeymap : true
                }),
                transparrentTheme,
                syntaxHighlighting,
                EditorView.lineWrapping,
                EditorView.updateListener.of(update => {
                    if (update.changes) {
                        onChange && onChange(update.state)
                    }
                })
            ]
        })

        const view = new EditorView({
            state : startState,
            parent : refContainer.current
        })

        setEditorView(view)
    },[refContainer])

    return [refContainer, editorView]
}

export default useCodeMirror;