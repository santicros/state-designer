// @refresh reset
import * as React from "react"
import { useColorMode } from "theme-ui"
import { editor } from "../../states/editor"
import { useStateDesigner } from "@state-designer/react"
import { codeX } from "../layout"
import { debounce } from "lodash"
import CodeEditor from "./code-editor"
import { useHighlights } from "./monaco"

const StateEditor: React.FC = (props) => {
  const local = useStateDesigner(editor)
  const rEditor = React.useRef<any>(null)
  const [colorMode] = useColorMode()

  useHighlights(rEditor, local.data.dirty)

  // Update the code editor's layout
  function updateMonacoLayout() {
    const editor = rEditor.current
    if (!!editor) {
      editor.layout()
    }
  }

  React.useEffect(() => {
    return codeX.onChange(debounce(updateMonacoLayout, 60))
  }, [])

  // Set up the monaco instance
  const setupMonaco = React.useCallback((_, editor) => {
    rEditor.current = editor

    // Focus / Blur events
    editor.onDidFocusEditorText(() => local.send("STARTED_EDITING"))

    editor.onDidBlurEditorText(() => local.send("STOPPED_EDITING"))

    // Save event
    editor.onKeyDown((e: KeyboardEvent) => {
      if (e.metaKey && e.code === "KeyS") {
        e.preventDefault()
        isAutoFormatting.current = true
        local.send("QUICK_SAVED")
      }
    })
  }, [])

  const isAutoFormatting = React.useRef(false)

  return (
    <CodeEditor
      theme={colorMode === "dark" ? "dark" : "light"}
      value={local.data.dirty}
      height="100%"
      width="100%"
      clean={local.data.clean}
      onChange={(_, code, editor) => {
        if (!code.startsWith(`createState({\n`)) {
          editor.trigger(code, "undo")
          return
        }

        if (!code.endsWith(`\n})\n`)) {
          editor.trigger(code, "undo")
          return
        }

        if (isAutoFormatting.current) {
          isAutoFormatting.current = false
        } else {
          local.send("CHANGED_CODE", { code })
        }
      }}
      language="javascript"
      options={{
        lineNumbers: false,
        showUnused: false,
        suggest: false,
        rulers: false,
        quickSuggestions: false,
        scrollBeyondLastLine: false,
        fontFamily: "Fira Code",
        fontSize: 13,
        fontWeight: 400,
        readOnly: local.isIn("guest"),
        minimap: {
          enabled: false,
        },
        smoothScrolling: true,
        lineDecorationsWidth: 4,
        fontLigatures: true,
        cursorBlinking: "smooth",
      }}
      editorDidMount={setupMonaco}
    />
  )
}

export default StateEditor