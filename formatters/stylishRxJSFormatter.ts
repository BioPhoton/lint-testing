import chalk from "chalk";

import {AbstractFormatter} from "tslint/lib/language/formatter/abstractFormatter";
import {IFormatterMetadata, RuleFailure, Utils} from "tslint";

export class Formatter extends AbstractFormatter {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: IFormatterMetadata = {
        formatterName: "stylishRxJS",
        description: "Human-readable formatter which creates stylish messages.",
        descriptionDetails: Utils.dedent`
            The output matches what is produced by ESLint's stylish formatter.
            Its readability is enhanced through spacing and colouring.`,
        sample: Utils.dedent`
        myFile.ts
        Error: 1:14  semicolon  Missing semicolon`,
        consumer: "human",
    };

    /* tslint:enable:object-literal-sort-keys */

    public format(failures: RuleFailure[]): string {
        failures = this.sortFailures(failures);
        const outputLines = this.mapToMessages(failures);

        // Removes initial blank line
        if (outputLines[0] === "") {
            outputLines.shift();
        }

        return `${outputLines.join("\n")}\n`;
    }

    private mapToMessages(failures: RuleFailure[]): string[] {
        if (failures.length === 0) {
            return [];
        }
        const outputLines: string[] = [];
        const positionMaxSize = this.getPositionMaxSize(failures);
        const ruleMaxSize = this.getRuleMaxSize(failures);

        let currentFile: string | undefined;

        for (const failure of failures) {
            const fileName = failure.getFileName();
            const lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
            let positionTuple = `${lineAndCharacter.line + 1}:${lineAndCharacter.character + 1}`;
            // Output the name of each file once
            if (currentFile !== fileName) {
                outputLines.push("");
                outputLines.push(`${fileName}${chalk.hidden(`:${positionTuple}`)}`);
                currentFile = fileName;
            }

            let failureString = this.replaceLinks(failure.getFailure());
            failureString = chalk.yellow(failureString);

            // Rule
            let ruleName = failure.getRuleName();
            ruleName = this.pad(ruleName, ruleMaxSize);
            ruleName = chalk.grey(ruleName);

            // Lines
            positionTuple = this.pad(positionTuple, positionMaxSize);

            positionTuple =
                failure.getRuleSeverity() === "warning"
                    ? chalk.blue(`${failure.getRuleSeverity().toUpperCase()}: ${positionTuple}`)
                    : chalk.red(`${failure.getRuleSeverity().toUpperCase()}: ${positionTuple}`);

            // Output
            const output = `${positionTuple}  ${ruleName}  ${failureString}`;

            outputLines.push(output);
        }
        return outputLines;
    }

    private replaceLinks(failureString: string): string {
        const likPattern = '@link';
        const linkIndex = failureString.indexOf(likPattern);
        const replaceStartIndex = failureString.indexOf('{');
        const replaceEndIndex = failureString.indexOf('}');
        if (linkIndex > -1) {

            let link = failureString.slice(linkIndex + likPattern.length);
            // @TODO use function from app_docs folder to get link
            link = 'https://rxjs.dev/api/index/function/' + link.slice(0, link.indexOf('}')).trim();

            failureString = failureString.slice(0, replaceStartIndex) + link + failureString.slice(replaceEndIndex +1)
        }
        return failureString;
    }

    private pad(str: string, len: number): string {
        const padder = Array(len + 1).join(" ");

        return (str + padder).substring(0, padder.length);
    }

    private getPositionMaxSize(failures: RuleFailure[]): number {
        let positionMaxSize = 0;

        for (const failure of failures) {
            const lineAndCharacter = failure.getStartPosition().getLineAndCharacter();

            const positionSize = `${lineAndCharacter.line + 1}:${lineAndCharacter.character + 1}`
                .length;

            if (positionSize > positionMaxSize) {
                positionMaxSize = positionSize;
            }
        }

        return positionMaxSize;
    }

    private getRuleMaxSize(failures: RuleFailure[]): number {
        let ruleMaxSize = 0;

        for (const failure of failures) {
            const ruleSize = failure.getRuleName().length;

            if (ruleSize > ruleMaxSize) {
                ruleMaxSize = ruleSize;
            }
        }

        return ruleMaxSize;
    }
}