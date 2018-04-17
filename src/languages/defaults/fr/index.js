const _eval = require('./commands/eval');
const help = require('./commands/help');
const lang = require('./commands/lang');
const ping = require('./commands/ping');
const prefix = require('./commands/prefix');

const disable = require('./commands/disable');
const enable = require('./commands/enable');
const groups = require('./commands/groups');
const load = require('./commands/load');
const reload = require('./commands/reload');
const unload = require('./commands/unload');

const prompts = require('./prompts');

const error = require('./errors/command-format');

/* eslint-disable max-len */

module.exports = {

  // EVAL command
  CMD_EVAL_DESCRIPTION: _eval.DESCRIPTION,
  CMD_EVAL_DETAILS: _eval.DETAILS,
  CMD_EVAL_RESULT: _eval.RESULT,
  CMD_EVAL_CALLBACK: _eval.CALLBACK,
  CMD_EVAL_EVALUATION_ERROR: _eval.EVALUATION_ERROR,
  CMD_EVAL_CALLBACK_ERROR: _eval.CALLBACK_ERROR,
  CMD_EVAL_ARGS_PROMPT_SCRIPT: _eval.ARGS_PROMPT_SCRIPT,

  // HELP command
  CMD_HELP_DESCRIPTION: help.DESCRIPTION,
  CMD_HELP_DETAILS: help.DETAILS,
  CMD_HELP_ALL: help.ALL,
  CMD_HELP_COMMAND: help.COMMAND,
  CMD_HELP_COMMAND_ALIASES: help.COMMAND_ALIASES,
  CMD_HELP_COMMAND_GROUP: help.COMMAND_GROUP,
  CMD_HELP_COMMAND_DETAILS: help.COMMAND_DETAILS,
  CMD_HELP_COMMAND_EXAMPLES: help.COMMAND_EXAMPLES,
  CMD_HELP_COMMAND_UNIDENTIFIED: help.COMMAND_UNIDENTIFIED,
  CMD_HELP_SENT_DM: help.SENT_DM,
  CMD_HELP_SENT_DM_FAILED: help.SENT_DM_FAILED,
  CMD_HELP_MULTIPLE_RESULTS: help.MULTIPLE_RESULTS,
  CMD_HELP_ARGS_PROMPT_COMMAND: help.ARGS_PROMPT_COMMAND,

  // LANGUAGE command
  CMD_LANG_DESCRIPTION: lang.DESCRIPTION,
  CMD_LANG_DETAILS: lang.DETAILS,
  CMD_LANG_CURRENT: lang.CURRENT,
  CMD_LANG_SET: lang.SET,
  CMD_LANG_RESET: lang.RESET,
  CMD_LANG_ADMIN_ONLY: lang.ADMIN_ONLY,
  CMD_LANG_OWNER_ONLY: lang.OWNER_ONLY,
  CMD_LANG_ARGS_PROMPT_LANGUAGE: lang.ARGS_PROMPT_LANGUAGE,

  // PING command
  CMD_PING_DESCRIPTION: ping.DESCRIPTION,
  CMD_PING_PINGING: ping.PINGING,
  CMD_PING_RESPONSE_IMMUTABLE: ping.RESPONSE_IMMUTABLE,
  CMD_PING_RESPONSE_EDITABLE: ping.RESPONSE_EDITABLE,

  // PREFIX command
  CMD_PREFIX_DESCRIPTION: prefix.DESCRIPTION,
  CMD_PREFIX_DETAILS: prefix.DETAILS,
  CMD_PREFIX_CURRENT: prefix.CURRENT,
  CMD_PREFIX_SET: prefix.SET,
  CMD_PREFIX_RESET: prefix.RESET,
  CMD_PREFIX_REMOVED: prefix.REMOVED,
  CMD_PREFIX_HINT: prefix.HINT,
  CMD_PREFIX_ADMIN_ONLY: prefix.ADMIN_ONLY,
  CMD_PREFIX_OWNER_ONLY: prefix.OWNER_ONLY,
  CMD_PREFIX_ARGS_PROMPT_PREFIX: prefix.ARGS_PROMPT_PREFIX,

  // DISABLE command
  CMD_DISABLE_DESCRIPTION: disable.DESCRIPTION,
  CMD_DISABLE_DETAILS: disable.DETAILS,
  CMD_DISABLE_DISABLED: disable.DISABLED,
  CMD_DISABLE_ALREADY_DISABLED: disable.ALREADY_DISABLED,
  CMD_DISABLE_NOT_ALLOWED: disable.NOT_ALLOWED,
  CMD_DISABLE_ARGS_PROMPT_CMDORGROUP: disable.ARGS_PROMPT_CMDORGROUP,

  // ENABLE command
  CMD_ENABLE_DESCRIPTION: enable.DESCRIPTION,
  CMD_ENABLE_DETAILS: enable.DETAILS,
  CMD_ENABLE_ENABLED: enable.ENABLED,
  CMD_ENABLE_ALREADY_ENABLED: enable.ALREADY_ENABLED,
  CMD_ENABLE_ARGS_PROMPT_CMDORGROUP: enable.ARGS_PROMPT_CMDORGROUP,

  // GROUPS command
  CMD_GROUPS_DESCRIPTION: groups.DESCRIPTION,
  CMD_GROUPS_DETAILS: groups.DETAILS,
  CMD_GROUPS_LIST: groups.LIST,

  // LOAD command
  CMD_LOAD_DESCRIPTION: load.DESCRIPTION,
  CMD_LOAD_DETAILS: load.DETAILS,
  CMD_LOAD_ARGS_PROMPT_COMMAND: load.ARGS_PROMPT_COMMAND,
  CMD_LOAD_LOADED: load.LOADED,
  CMD_LOAD_LOADED_REPLICATION_FAILED: load.LOADED_REPLICATION_FAILED,
  CMD_LOAD_ALREADY_REGISTERED: load.ALREADY_REGISTERED,

  // RELOAD command
  CMD_RELOAD_DESCRIPTION: reload.DESCRIPTION,
  CMD_RELOAD_DETAILS: reload.DETAILS,
  CMD_RELOAD_ARGS_PROMPT_COMMAND: reload.ARGS_PROMPT_COMMAND,
  CMD_RELOAD_RELOADED_COMMAND_REPLICATION_FAILED: reload.RELOADED_COMMAND_REPLICATION_FAILED,
  CMD_RELOAD_RELOADED_GROUP_REPLICATION_FAILED: reload.RELOADED_GROUP_REPLICATION_FAILED,
  CMD_RELOAD_RELOADED_COMMAND: reload.RELOADED_COMMAND,
  CMD_RELOAD_RELOADED_GROUP: reload.RELOADED_GROUP,

  // UNLOAD command
  CMD_UNLOAD_DESCRIPTION: unload.DESCRIPTION,
  CMD_UNLOAD_DETAILS: unload.DETAILS,
  CMD_UNLOAD_ARGS_PROMPT_COMMAND: unload.ARGS_PROMPT_COMMAND,
  CMD_UNLOAD_UNLOADED: unload.UNLOADED,
  CMD_UNLOAD_UNLOADED_REPLICATION_FAILED: unload.UNLOADED_REPLICATION_FAILED,

  // Prompts
  PROMPT_INVALID_ARG: prompts.INVALID_ARG,
  PROMPT_CANCEL: prompts.CANCEL,
  PROMPT_CANCELLED: prompts.CANCELLED,
  PROMPT_INFINITE_CANCEL: prompts.INFINITE_CANCEL,
  PROMPT_INFINITE_INVALID_ARG: prompts.INFINITE_INVALID_ARG,

  // Friendly errors
  CMD_FORMAT_ERROR: error.FORMAT_ERROR
};
