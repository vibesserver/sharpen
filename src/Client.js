const { Client: DiscordClient } = require('discord.js');
const LanguageRegistry = require('./languages/LanguageRegistry');
const CommandRegistry = require('./commands/CommandRegistry');
const CommandDispatcher = require('./commands/CommandDispatcher');
const GuildSettingsHelper = require('./helpers/GuildSettingsHelper');

/**
* Options for a Client
* @typedef {DiscordClientOptions} ClientOptions
* @property {boolean} [selfbot=false] - Whether the command dispatcher should be in selfbot mode
* @property {string} [commandPrefix='!'] - Default command prefix
* @property {number} [commandEditableDuration=30] - Time in seconds that command messages should be editable
* @property {boolean} [nonCommandEditable=true] - Whether messages without commands can be edited to a command
* @property {boolean} [unknownCommandResponse=true] - Whether the bot should respond to an unknown command
* @property {string|string[]|Set<string>} [owner] - ID of the bot owner's Discord user, or multiple IDs
* @property {string} [invite] - Invite URL to the bot's support server
* @property {string} [lang='en'] - Default language for sending messages
*/

/**
 * Emitted upon the client's provider finishing initialisation
 * @event Client#providerReady
 * @param {SettingProvider} provider - Provider that was initialised
 */

/**
* Discord.js Client with a command framework
* @extends {DiscordClient}
*/
class Client extends DiscordClient {

  /**
   * Constructs the client
   * @param {ClientOptions} [options] - Options for the client
   */
  constructor(options = {}) {
    if (typeof options.selfbot === 'undefined') options.selfbot = false;
    if (typeof options.commandPrefix === 'undefined') options.commandPrefix = '!';
    if (options.commandPrefix === null) options.commandPrefix = '';
    if (typeof options.commandEditableDuration === 'undefined') options.commandEditableDuration = 30;
    if (typeof options.nonCommandEditable === 'undefined') options.nonCommandEditable = true;
    if (typeof options.unknownCommandResponse === 'undefined') options.unknownCommandResponse = true;
    if (typeof options.lang === 'undefined') options.lang = 'en';
    super(options);

    /**
     * The client's command registry
     * @type {CommandRegistry}
     */
    this.registry = new CommandRegistry(this);

    /**
     * The client's command dispatcher
     * @type {CommandDispatcher}
     */
    this.dispatcher = new CommandDispatcher(this, this.registry);

    /**
     * The client's setting provider
     * @type {?SettingProvider}
     */
    this.provider = null;

    /**
     * Shortcut to use setting provider methods for the global settings
     * @type {GuildSettingsHelper}
     */
    this.settings = new GuildSettingsHelper(this, null);

    /**
     * The client's language registry
     * @type {LanguageRegistry}
     */
    this.translator = new LanguageRegistry(this);

    /**
     * Internal global command prefix, controlled by the {@link Client#commandPrefix} getter/setter
     * @type {?string}
     * @private
     */
    this._commandPrefix = null;

    /**
     * Internal global language, constrolled by the {@link Client#lang} getter/setter
     * @type {?string}
     * @private
     */
    this._lang = null;

    // Set up command handling
    const msgErr = (err) => { this.emit('error', err); };
    this.on('message', (message) => { this.dispatcher.handleMessage(message).catch(msgErr); });
    this.on('messageUpdate', (oldMessage, newMessage) => {
      this.dispatcher.handleMessage(newMessage, oldMessage).catch(msgErr);
    });

    // Fetch the owner(s)
    if (options.owner) {
      this.once('ready', () => {
        if (options.owner instanceof Array || options.owner instanceof Set) {
          for (const owner of options.owner) {
            this.users.fetch(owner).catch((err) => {
              this.emit('warn', `Unable to fetch owner ${owner}.`);
              this.emit('error', err);
            });
          }
        } else {
          this.users.fetch(options.owner).catch((err) => {
            this.emit('warn', `Unable to fetch owner ${options.owner}.`);
            this.emit('error', err);
          });
        }
      });
    }
  }

  /**
   * Global command prefix. An empty string indicates that there is no default prefix, and only mentions will be used.
   * Setting to `null` means that the default prefix from {@link Client#options} will be used instead.
   * @type {string}
   * @emits {@link Client#commandPrefixChange}
   */
  get commandPrefix() {
    if (typeof this._commandPrefix === 'undefined' || this._commandPrefix === null) return this.options.commandPrefix;
    return this._commandPrefix;
  }

  set commandPrefix(prefix) {
    this._commandPrefix = prefix;
    this.emit('commandPrefixChange', null, this._commandPrefix);
  }

  /**
   * Global language. Setting to `null` means that the language from {@link Client#options} will be used instead.
   * @type {string}
   * @emits {@link Client#languageChange}
   */
  get lang() {
    if (typeof this._lang === 'undefined' || this._lang === null) return this.options.lang;
    return this._lang;
  }

  set lang(lang) {
    this._lang = lang;
    this.emit('languageChange', null, this._lang);
  }

  /**
   * Owners of the bot, set by the {@link ClientOptions#owner} option.
   * <info>If you simply need to check if a user is an owner of the bot, please instead use
   * {@link Client#isOwner}.</info>
   * @type {?Array<User>}
   * @readonly
   */
  get owners() {
    if (!this.options.owner) return null;
    if (typeof this.options.owner === 'string') return [ this.users.get(this.options.owner) ];
    const owners = [];
    for (const owner of this.options.owner) owners.push(this.users.get(owner));
    return owners;
  }

  /**
   * Checks whether a user is an owner of the bot (in {@link ClientOptions#owner}).
   * @param {UserResolvable} user - User to check for ownership
   * @returns {boolean}
   */
  isOwner(user) {
    if (!this.options.owner) return false;
    user = this.users.resolve(user);
    if (!user) throw new RangeError('Unable to resolve user.');
    if (typeof this.options.owner === 'string') return user.id === this.options.owner;
    if (this.options.owner instanceof Array) return this.options.owner.includes(user.id);
    if (this.options.owner instanceof Set) return this.options.owner.has(user.id);
    throw new RangeError('The client\'s "owner" option is an unknown value.');
  }

  /**
   * Sets the setting provider to use, and initialises it once the client is ready.
   * @param {SettingProvider|Promise<SettingProvider>} provider Provider to use
   * @returns {Promise<void>}
   */
  async setProvider(provider) {
    provider = await provider;
    this.provider = provider;

    if (this.readyTimestamp) {
      this.emit('debug', `Provider set to ${provider.constructor.name} - initialising...`);
      await provider.init(this);
      this.emit('debug', 'Provider finished initialisation.');
      return undefined;
    }

    this.emit('debug', `Provider set to ${provider.constructor.name} - will initialise once ready.`);
    await new Promise((resolve) => {
      this.once('ready', () => {
        this.emit('debug', `Initialising provider...`);
        resolve(provider.init(this));
      });
    });

    this.emit('providerReady', provider);
    this.emit('debug', 'Provider finished initialisation.');
    return undefined;
  }

  async destroy() {
    await super.destroy();
    if (this.provider) await this.provider.destroy();
  }
}

/**
 * Exports the client.
 * @type {Client}
 */
module.exports = Client;