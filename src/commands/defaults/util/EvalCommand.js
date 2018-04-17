const util = require('util');
const { splitMessage } = require('discord.js');
const { escapeRegex } = require('../../../utils');
const Command = require('../../Command');

const nl = '!!NL!!';
const nlPattern = new RegExp(nl, 'g');

module.exports = class EvalCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'eval',
      group: 'util',
      memberName: 'eval',
      description: 'CMD_EVAL_DESCRIPTION',
      details: 'CMD_EVAL_DETAILS',
      ownerOnly: true,

      args: [
        {
          key: 'script',
          prompt: 'CMD_EVAL_ARGS_PROMPT_SCRIPT',
          type: 'string'
        }
      ]
    });

    this.lastResult = null;
  }

  run(msg, args) {
    // Make a bunch of helpers
    /* eslint-disable no-unused-vars */
    const message = msg;
    const client = msg.client;
    const objects = client.registry.evalObjects;
    const lastResult = this.lastResult;
    const doReply = (val) => {
      if (val instanceof Error) {
        msg.reply(msg.translate('CMD_EVAL_CALLBACK_ERROR', val));
      } else {
        const result = this.makeResultMessages(msg, val, process.hrtime(this.hrStart));
        if (Array.isArray(result)) {
          for (const item of result) {
            if (this.client.options.selfbot) msg.say(item); else msg.reply(item);
          }
        } else if (this.client.options.selfbot) {
          msg.say(result);
        } else {
          msg.reply(result);
        }
      }
    };
    /* eslint-enable no-unused-vars */

    // Run the code and measure its execution time
    let hrDiff;
    try {
      const hrStart = process.hrtime();
      this.lastResult = eval(args.script);
      hrDiff = process.hrtime(hrStart);
    } catch (err) {
      return msg.reply(msg.translate('CMD_EVAL_EVALUATION_ERROR', err));
    }

    // Prepare for callback time and respond
    this.hrStart = process.hrtime();
    let response = this.makeResultMessages(msg, this.lastResult, hrDiff, args.script, msg.editable);
    if (msg.editable) {
      if (response instanceof Array) {
        if (response.length > 0) response = response.slice(1, response.length - 1);
        for (const re of response) msg.say(re);
        return null;
      } else {
        return msg.edit(response);
      }
    } else {
      return msg.reply(response);
    }
  }

  makeResultMessages(msg, result, hrDiff, input = null, editable = false) {
    const inspected = util.inspect(result, { depth: 0 })
      .replace(nlPattern, '\n')
      .replace(this.sensitivePattern, '--snip--');
    const split = inspected.split('\n');
    const last = inspected.length - 1;
    const prependPart = inspected[0] !== '{' && inspected[0] !== '[' && inspected[0] !== "'" ? split[0] : inspected[0];
    const appendPart = inspected[last] !== '}' && inspected[last] !== ']' && inspected[last] !== "'" ?
      split[split.length - 1] :
      inspected[last];
    const prepend = `\`\`\`javascript\n${prependPart}\n`;
    const append = `\n${appendPart}\n\`\`\``;
    if (input) {
      return splitMessage(
        msg.translate('CMD_EVAL_RESULT', editable, hrDiff, inspected, input),
        1900, '\n', prepend, append
      );
    } else {
      return splitMessage(
        msg.translate('CMD_EVAL_CALLBACK', hrDiff, inspected),
        1900, '\n', prepend, append
      );
    }
  }

  get sensitivePattern() {
    if (!this._sensitivePattern) {
      const client = this.client;
      let pattern = '';
      if (client.token) pattern += escapeRegex(client.token);
      Object.defineProperty(this, '_sensitivePattern', { value: new RegExp(pattern, 'gi') });
    }
    return this._sensitivePattern;
  }
};
