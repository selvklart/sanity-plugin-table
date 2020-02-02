import uuid from '@sanity/uuid';
import React from 'react';
import PropTypes from 'prop-types';
import Table from './components/table';
import PatchEvent, { set, unset } from 'part:@sanity/form-builder/patch-event';
import FieldSet from 'part:@sanity/components/fieldsets/default';
import ButtonCollection from 'part:@sanity/components/buttons/button-collection';
import Button from 'part:@sanity/components/buttons/default';

const createPatchFrom = value => {
  return PatchEvent.from(set(value));
};

export default class TableInput extends React.Component {
  static propTypes = {
    type: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      options: PropTypes.shape({
        collapsible: PropTypes.bool,
        collapsed: PropTypes.bool,
        initialRows: PropTypes.number,
        initialColumns: PropTypes.number,
        minRows: PropTypes.number,
        minColumns: PropTypes.number,
        maxRows: PropTypes.number,
        maxColumns: PropTypes.number,
      }),
    }).isRequired,
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  };

  updateCell = (e, rowIndex, cellIndex) => {
    const { value, onChange } = this.props;
    // Clone the current table data
    const newValue = { ...value };
    newValue.rows[rowIndex].cells[cellIndex] = e.target.value;
    return onChange(createPatchFrom(newValue));
  };

  initializeTable = () => {
    const {
      onChange,
      type: { options },
    } = this.props;

    const rowCount = options.initialRows || 1;
    const colCount = options.initialColumns || 1;

    // Add a single row with a single empty cell (1 row, 1 column)
    const newValue = {
      rows: Array(rowCount)
        .fill()
        .map(() =>
          this.buildRow({
            cells: Array(colCount)
              .fill()
              .map(() => ''),
          }),
        ),
    };

    return onChange(createPatchFrom(newValue));
  };

  buildRow = ({ mode, cells }) => ({
    _type: 'tableRow',
    _key: uuid(),
    cells,
    mode: mode || 'row',
  });

  addRow = ({ mode }) => {
    const {
      value,
      onChange,
      type: { options },
    } = this.props;
    // If we have an empty table, create a new one
    if (!value) return this.initializeTable();
    if (value.rows.length >= options.maxRows) return;
    // Clone the current table data
    const newValue = { ...value };
    // Calculate the column count from the first row
    const columnCount = value.rows[0].cells.length;

    newValue.rows.push(
      this.buildRow({
        mode: mode || 'row',
        cells: mode === 'heading' ? [''] : Array(columnCount).fill(''),
      }),
    );

    return onChange(createPatchFrom(newValue));
  };

  removeRow = index => {
    const {
      value,
      onChange,
      type: { options },
    } = this.props;

    if (value.rows.length <= options.minRows) return;

    // Clone the current table data
    const newValue = { ...value };
    // Remove the row via index
    newValue.rows.splice(index, 1);
    // If the last row was removed, clear the table
    if (!newValue.rows.length) {
      this.clear();
    }
    return onChange(createPatchFrom(newValue));
  };

  addColumn = e => {
    const {
      value,
      onChange,
      type: { options },
    } = this.props;
    // If we have an empty table, create a new one
    if (!value) return this.initializeTable();
    if (this.getColumnCount() >= options.maxColumns) return;

    // Clone the current table data
    const newValue = { ...value };
    // Add a cell to each of the rows
    newValue.rows.forEach((row, i) => {
      if (row.mode !== 'heading') {
        newValue.rows[i].cells.push('');
      }
    });
    return onChange(createPatchFrom(newValue));
  };

  removeColumn = index => {
    const {
      value,
      onChange,
      type: { options },
    } = this.props;
    if (this.getColumnCount() <= options.minColumns) return;

    // Clone the current table data
    const newValue = { ...value };
    // For each of the rows, remove the cell by index
    newValue.rows.forEach(row => {
      row.cells.splice(index, 1);
    });
    // If the last cell was removed, clear the table
    if (!newValue.rows[0].cells.length) {
      this.clear();
    }
    return onChange(createPatchFrom(newValue));
  };

  // Unsets the entire table value
  clear = () => {
    const { onChange } = this.props;
    return onChange(PatchEvent.from(unset()));
  };

  getColumnCount = () => {
    const { value } = this.props;
    return value?.rows?.find(row => row.mode === 'row')?.cells.length || 0;
  };

  render() {
    const { type, value } = this.props;
    const { title, description, options } = type;

    const table =
      value && value.rows && value.rows.length ? (
        <Table
          rows={value.rows}
          updateCell={this.updateCell}
          removeColumn={this.removeColumn}
          removeRow={this.removeRow}
        />
      ) : null;

    const buttons = value ? (
      <ButtonCollection>
        <Button
          disabled={value?.rows?.length >= options.maxRows}
          inverted
          onClick={this.addRow}
        >
          Add Row
        </Button>
        <Button
          inverted
          onClick={() => {
            this.addRow({ mode: 'heading' });
          }}
        >
          Add Heading
        </Button>
        <Button
          disabled={this.getColumnCount() >= options.maxColumns}
          inverted
          onClick={this.addColumn}
        >
          Add Column
        </Button>
        <Button inverted color="danger" onClick={this.clear}>
          Clear
        </Button>
      </ButtonCollection>
    ) : (
      <Button color="primary" onClick={this.initializeTable}>
        New Table
      </Button>
    );

    return (
      <FieldSet
        legend={title}
        description={description}
        isCollapsible={options.collapsible}
        isCollapsed={options.collapsed}
      >
        {table}
        {buttons}
      </FieldSet>
    );
  }
}
