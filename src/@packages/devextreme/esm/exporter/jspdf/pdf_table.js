/**
 * DevExtreme (esm/exporter/jspdf/pdf_table.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    isDefined
} from "../../core/utils/type";
import {
    drawPdfTable
} from "./draw_pdf_table";
export class PdfTable {
    constructor(drawTableBorder, topLeft, columnWidths) {
        if (!isDefined(columnWidths)) {
            throw "columnWidths is required"
        }
        if (!isDefined(topLeft)) {
            throw "topLeft is required"
        }
        this.drawTableBorder = drawTableBorder;
        this.rect = {
            x: topLeft.x,
            y: topLeft.y,
            w: columnWidths.reduce((a, b) => a + b, 0),
            h: 0
        };
        this.columnWidths = columnWidths;
        this.rowHeights = [];
        this.rows = []
    }
    getCellX(cellIndex) {
        return this.rect.x + this.columnWidths.slice(0, cellIndex).reduce((a, b) => a + b, 0)
    }
    getCellY(rowIndex) {
        return this.rect.y + this.rowHeights.slice(0, rowIndex).reduce((a, b) => a + b, 0)
    }
    addRow(cells, rowHeight) {
        if (!isDefined(cells)) {
            throw "cells is required"
        }
        if (cells.length !== this.columnWidths.length) {
            throw "the length of the cells must be equal to the length of the column"
        }
        if (!isDefined(rowHeight)) {
            throw "rowHeight is required"
        }
        this.rows.push(cells);
        this.rowHeights.push(rowHeight);
        for (var i = 0; i < cells.length; i++) {
            var currentCell = cells[i];
            if (false === currentCell.drawLeftBorder && !isDefined(currentCell.colSpan)) {
                if (i >= 1) {
                    cells[i - 1].drawRightBorder = false
                }
            } else if (!isDefined(currentCell.drawLeftBorder)) {
                if (i >= 1 && false === cells[i - 1].drawRightBorder) {
                    currentCell.drawLeftBorder = false
                }
            }
            if (false === currentCell.drawTopBorder) {
                if (this.rows.length >= 2) {
                    this.rows[this.rows.length - 2][i].drawBottomBorder = false
                }
            } else if (!isDefined(currentCell.drawTopBorder)) {
                if (this.rows.length >= 2 && false === this.rows[this.rows.length - 2][i].drawBottomBorder) {
                    currentCell.drawTopBorder = false
                }
            }
            var columnWidth = this.columnWidths[i];
            if (!isDefined(columnWidth)) {
                throw "column width is required"
            }
            currentCell._rect = {
                x: this.getCellX(i),
                y: this.getCellY(this.rows.length - 1),
                w: columnWidth,
                h: rowHeight
            }
        }
        this.rect.h = this.rowHeights.reduce((a, b) => a + b, 0)
    }
    drawTo(doc) {
        drawPdfTable(doc, this)
    }
}
