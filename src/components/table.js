import React from 'react';
import PropTypes from 'prop-types';
import styles from './table.css';

const Table = ({ rows, updateCell, removeColumn, removeRow }) => {
  if (!rows || !rows.length) return null;

  // Button to remove column
  const renderColumnRemover = index => (
    <td key={index} className={styles.colDelete}>
      <span onClick={() => removeColumn(index)} />
    </td>
  );

  const renderColumnRemovers = row => (
    <tr>{row.cells.map((c, i) => renderColumnRemover(i))}</tr>
  );

  return (
    <table className={styles.table}>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            {row.cells.map((cell, cellIndex) => (
              <td
                key={`cell-${cellIndex}`}
                className={[styles.cell, styles[`cell--${row.mode}`]]
                  .filter(c => c)
                  .join(' ')}
                colSpan={row.mode === 'heading' ? rows[0].cells.length : 1}
              >
                <input
                  className={styles.input}
                  type="text"
                  value={cell}
                  onChange={e => updateCell(e, rowIndex, cellIndex)}
                />
              </td>
            ))}

            <RowRemover onClick={() => removeRow(rowIndex)} />
          </tr>
        ))}
        {renderColumnRemovers(rows[0])}
      </tbody>
    </table>
  );
};

Table.propTypes = {
  rows: PropTypes.array,
  updateCell: PropTypes.func,
  removeColumn: PropTypes.func,
  removeRow: PropTypes.func,
};

export default Table;

const RowRemover = ({ onClick }) => (
  <td className={styles.rowDelete}>
    <span onClick={onClick} />
  </td>
);
