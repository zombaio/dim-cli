/**
 * Part of the dimcoin/dim-cli package.
 *
 * NOTICE OF LICENSE
 *
 * Licensed under MIT License.
 *
 * This source file is subject to the MIT License that is
 * bundled with this package in the LICENSE file.
 *
 * @package    dimcoin/dim-cli
 * @author     DIMCoin Developers
 * @license    MIT License
 * @copyright  (c) 2018, DIMCoin Developers
 * @link       https://github.com/dimcoin/dim-cli
 */
"use strict";

import * as Excel from "xlsx";
import * as fs from "fs";

/**
 * The Formatter class will provide with different data
 * formatting techniques such as XLSX, JSON and CSV as 
 * a first.
 */
class Formatter {

    /**
     * Construct the Formatter object
     */
    constructor() {

        let utc = new Date().toJSON().slice(0,10).replace(/-/g, ''); // 2018-01-11 to 20180111

        /**
         * The produced absolute file path
         *
         * @var {string}
         */
        this.filepath = "";

        /**
         * The default filename extension.
         *
         * @var {String}
         */
        this.extension = "xlsx";

        /**
         * The rows array
         *
         * @var {Array}
         */
        this.rows = new Array();
    }

    /**
     * This method initializes the data formatter properties.
     *
     * @param {String} filepath     Absolute file path with file name.
     * @return {Formatter}
     */
    init(filepath, append = false) {
        this.filepath  = filepath;
        let fileExists = fs.existsSync(this.filepath);
        if (fileExists && append === true) {
            // read already available workbook.
            this.rows = this.__fromFile(this.filepath);
        }
        else if (fileExists) {
            // must empty file
            this.rows = [];
            this.save();
        }

        return this;
    }

    /**
     * This method lets you add a row to the formatter stream.
     *
     * @param {Object} data     Row to be added.
     * @return {Formatter}
     */
    write(data) {
        this.rows.push(data);
        return this;
    }

    /**
     * This method lets you add a collection of rows to the formatter
     * stream.
     *
     * @param {Object} data     Row to be added.
     * @return {Formatter}
     */
    writeRows(data) {
        this.rows = this.rows.concat(data);
        return this;
    }

    /**
     * Getter for the `rows` property.
     * 
     * @return {Array}
     */
    getRows() {
        return this.rows || [];
    }

    /**
     * This method will save to the specified file.
     *
     * @return {Formatter}
     */
    save() {
        return this.__toFile(this.filepath);
    }

    /**
     * This method must be overloaded by extending classes.
     *
     * It should internally load data from the specified `filePath`.
     *
     * @param {String} filePath     Absolute file path with file name.
     * @return {Formatter}
     */
    __fromFile(filePath) {
        throw new Error("Please implement `__fromFile(filePath): Formatter` in your Formatter extending class.");
    }

    /**
     * This method must be overloaded by extending classes.
     *
     * It should internally save to the specified `filePath`.
     *
     * @param {String} filePath     Absolute file path with file name.
     * @return {Formatter}
     */
    __toFile(filePath) {
        throw new Error("Please implement `__toFile(filePath): Formatter` in your Formatter extending class.");
    }

    /**
     * Helper to sort rows by a given field name.
     * @param {String} field 
     */
    sortByField(field, reverse = false) {
        this.rows.sort(function(a, b) {
            if (a[field] > b[field])
                return 1;
            else if (a[field] < b[field])
                return -1;

            return 0;
        }.bind(this));

        if (reverse === true)
            this.rows.reverse();

        return this;
    }

}

exports.Formatter = Formatter;
export default Formatter;
