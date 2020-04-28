import * as React from "react"
import { motion } from "framer-motion"

import game from "../game"
import { useStateDesigner } from "state-designer"

import * as Shared from "./Shared"
import * as DS from "../game/types"
import things from "../game/things"

export type Props = {
  item: DS.Item
  offsetX: number
  offsetY: number
}

const Ghost: React.FC<Props> = ({ item, offsetX, offsetY }) => {
  const { isIn } = useStateDesigner(game)
  const thing = things[item.thing]

  return (
    <div
      style={{
        padding: 4,
        fontSize: 10,
        gridColumn: `${item.point.x + 1 + offsetX} / span ${thing.size.width}`,
        gridRow: `${item.point.y + 1 + offsetY} / span ${thing.size.height}`,
        border: "1px solid var(--zh-thunder)",
        backgroundColor: isIn("valid")
          ? "var(--zh-goblin)"
          : "var(--zh-medium-carmine)",
        userSelect: "none",
      }}
    />
  )
}

export default Ghost