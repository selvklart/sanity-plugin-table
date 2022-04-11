import React from "react"
import PropTypes from "prop-types"
import { Reorder } from "framer-motion"
import styles from "./table.css"

const Table = ({
  rows,
  updateCell,
  removeColumn,
  removeRow,
  replaceState,
  highlightFirstRow,
}) => {
  if (!rows || !rows.length) return null

  // Button to remove column
  const renderColumnRemover = index => (
    <div key={index} className={styles.colDelete}>
      <span onClick={() => removeColumn(index)} />
    </div>
  )

  const renderColumnRemovers = row => (
    <li
      style={{
        display: "grid",
        gridTemplateColumns: `30px repeat(${rows[0].cells.length}, 1fr) 30px`,
        alignContent: "center",
        marginTop: 10,
      }}
    >
      <div />
      {row.cells.map((c, i) => renderColumnRemover(i))}
      <div />
    </li>
  )

  return (
    <div
      className={[styles.table, highlightFirstRow && styles.highlightFirstRow]
        .filter(Boolean)
        .join(" ")}
    >
      <Reorder.Group
        as="ul"
        values={rows}
        axis="y"
        onReorder={value => {
          replaceState({ rows: value })
        }}
        style={{
          listStyle: "none",
        }}
      >
        {rows.map((row, rowIndex) => (
          <Reorder.Item
            key={row._key}
            value={row}
            style={{
              display: "grid",
              gridTemplateColumns: `30px repeat(${rows[0].cells.length}, 1fr) 30px`,
              alignItems: "center",
            }}
            whileDrag={{
              opacity: 0.9,
            }}
          >
            <span style={{ cursor: "ns-resize" }}>
              <svg
                data-sanity-icon="drag-handle"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.5 8C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5C8.67157 5 8 5.67157 8 6.5C8 7.32843 8.67157 8 9.5 8ZM9.5 14C10.3284 14 11 13.3284 11 12.5C11 11.6716 10.3284 11 9.5 11C8.67157 11 8 11.6716 8 12.5C8 13.3284 8.67157 14 9.5 14ZM11 18.5C11 19.3284 10.3284 20 9.5 20C8.67157 20 8 19.3284 8 18.5C8 17.6716 8.67157 17 9.5 17C10.3284 17 11 17.6716 11 18.5ZM15.5 8C16.3284 8 17 7.32843 17 6.5C17 5.67157 16.3284 5 15.5 5C14.6716 5 14 5.67157 14 6.5C14 7.32843 14.6716 8 15.5 8ZM17 12.5C17 13.3284 16.3284 14 15.5 14C14.6716 14 14 13.3284 14 12.5C14 11.6716 14.6716 11 15.5 11C16.3284 11 17 11.6716 17 12.5ZM15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z"
                  fill="currentColor"
                />
              </svg>
            </span>

            {row.cells.map((cell, cellIndex) => (
              <div
                key={`cell-${cellIndex}`}
                className={[styles.cell, styles[`cell--${row.mode}`]]
                  .filter(Boolean)
                  .join(" ")}
              >
                <input
                  className={styles.input}
                  type="text"
                  value={cell}
                  onChange={e => updateCell(e, rowIndex, cellIndex)}
                />
              </div>
            ))}

            <RowRemover onClick={() => removeRow(rowIndex)} />
          </Reorder.Item>
        ))}

        {renderColumnRemovers(rows[0])}
      </Reorder.Group>
    </div>
  )
}

Table.propTypes = {
  rows: PropTypes.array,
  updateCell: PropTypes.func,
  removeColumn: PropTypes.func,
  removeRow: PropTypes.func.isRequired,
  replaceState: PropTypes.func.isRequired,
  highlightFirstRow: PropTypes.bool,
}

export default Table

const RowRemover = ({ onClick }) => (
  <div className={styles.rowDelete}>
    <span onClick={onClick} />
  </div>
)

RowRemover.propTypes = {
  onClick: PropTypes.func.isRequired,
}
