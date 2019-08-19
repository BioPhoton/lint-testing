"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var abstractFormatter_1 = require("tslint/lib/language/formatter/abstractFormatter");
var tslint_1 = require("tslint");
var Formatter = /** @class */ (function (_super) {
    __extends(Formatter, _super);
    function Formatter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* tslint:enable:object-literal-sort-keys */
    Formatter.prototype.format = function (failures) {
        failures = this.sortFailures(failures);
        var outputLines = this.mapToMessages(failures);
        // Removes initial blank line
        if (outputLines[0] === "") {
            outputLines.shift();
        }
        return outputLines.join("\n") + "\n";
    };
    Formatter.prototype.mapToMessages = function (failures) {
        if (failures.length === 0) {
            return [];
        }
        var outputLines = [];
        var positionMaxSize = this.getPositionMaxSize(failures);
        var ruleMaxSize = this.getRuleMaxSize(failures);
        var currentFile;
        for (var _i = 0, failures_1 = failures; _i < failures_1.length; _i++) {
            var failure = failures_1[_i];
            var fileName = failure.getFileName();
            var lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
            var positionTuple = lineAndCharacter.line + 1 + ":" + (lineAndCharacter.character + 1);
            // Output the name of each file once
            if (currentFile !== fileName) {
                outputLines.push("");
                outputLines.push("" + fileName + chalk_1.default.hidden(":" + positionTuple));
                currentFile = fileName;
            }
            var failureString = this.replaceLinks(failure.getFailure());
            failureString = chalk_1.default.yellow(failureString);
            // Rule
            var ruleName = failure.getRuleName();
            ruleName = this.pad(ruleName, ruleMaxSize);
            ruleName = chalk_1.default.grey(ruleName);
            // Lines
            positionTuple = this.pad(positionTuple, positionMaxSize);
            positionTuple =
                failure.getRuleSeverity() === "warning"
                    ? chalk_1.default.blue(failure.getRuleSeverity().toUpperCase() + ": " + positionTuple)
                    : chalk_1.default.red(failure.getRuleSeverity().toUpperCase() + ": " + positionTuple);
            // Output
            var output = positionTuple + "  " + ruleName + "  " + failureString;
            outputLines.push(output);
        }
        return outputLines;
    };
    Formatter.prototype.replaceLinks = function (failureString) {
        var likPattern = '@link';
        var linkIndex = failureString.indexOf(likPattern);
        var replaceStartIndex = failureString.indexOf('{');
        var replaceEndIndex = failureString.indexOf('}');
        if (linkIndex > -1) {
            var link = failureString.slice(linkIndex + likPattern.length);
            // @TODO use function from app_docs folder to get link
            link = 'https://rxjs.dev/api/index/function/' + link.slice(0, link.indexOf('}')).trim();
            failureString = failureString.slice(0, replaceStartIndex) + link + failureString.slice(replaceEndIndex + 1);
        }
        return failureString;
    };
    Formatter.prototype.pad = function (str, len) {
        var padder = Array(len + 1).join(" ");
        return (str + padder).substring(0, padder.length);
    };
    Formatter.prototype.getPositionMaxSize = function (failures) {
        var positionMaxSize = 0;
        for (var _i = 0, failures_2 = failures; _i < failures_2.length; _i++) {
            var failure = failures_2[_i];
            var lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
            var positionSize = (lineAndCharacter.line + 1 + ":" + (lineAndCharacter.character + 1))
                .length;
            if (positionSize > positionMaxSize) {
                positionMaxSize = positionSize;
            }
        }
        return positionMaxSize;
    };
    Formatter.prototype.getRuleMaxSize = function (failures) {
        var ruleMaxSize = 0;
        for (var _i = 0, failures_3 = failures; _i < failures_3.length; _i++) {
            var failure = failures_3[_i];
            var ruleSize = failure.getRuleName().length;
            if (ruleSize > ruleMaxSize) {
                ruleMaxSize = ruleSize;
            }
        }
        return ruleMaxSize;
    };
    /* tslint:disable:object-literal-sort-keys */
    Formatter.metadata = {
        formatterName: "stylishRxJS",
        description: "Human-readable formatter which creates stylish messages.",
        descriptionDetails: tslint_1.Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            The output matches what is produced by ESLint's stylish formatter.\n            Its readability is enhanced through spacing and colouring."], ["\n            The output matches what is produced by ESLint's stylish formatter.\n            Its readability is enhanced through spacing and colouring."]))),
        sample: tslint_1.Utils.dedent(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n        myFile.ts\n        Error: 1:14  semicolon  Missing semicolon"], ["\n        myFile.ts\n        Error: 1:14  semicolon  Missing semicolon"]))),
        consumer: "human",
    };
    return Formatter;
}(abstractFormatter_1.AbstractFormatter));
exports.Formatter = Formatter;
var templateObject_1, templateObject_2;
