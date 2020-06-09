/** @abstract */
declare class YologPlugin {
    /**
     * Method called when a log message is intercepted and the plugin is listening to the given tag.
     *
     * @param tag       Tag which was used when logging the message.
     * @param timestamp Timestamp (in ms) when the log was intercepted by the Yolog instance.
     * @param message   Message that is passed to the plugin.
     * @param error      Error generated in the logger to be possible to use for call stack or for other reasons.
     * @abstract
     */
    public log(tag: string, timestamp: number, message: string, error: Error): Promise<void>;
    /**
     * Set state of a given tag for the plugin.
     * If value is omitted, the state will be toggled.
     *
     * @param tag Tag to change the state of.
     * @param state State to set the tag to.
     * @return Self.
     */
    public set(tag: string, state?: boolean): YologPlugin;
    /**
     * Get state of given tag for the plugin.
     *
     * @param tag Tag to check state on.
     * @return State of the tag.
     */
    public get(tag: string): boolean;
    /**
     * Getter to fetch a list of all available tags.
     *
     * @return List of available tags.
     */
    public readonly available: string[];
    /**
     * Getter to fetch what tags that the plugin is listening to.
     *
     * @return List of active tags.
     */
    public readonly active: string[];
}

/**
 * Tags states, true means active, false means inactive.
 */
declare interface Tags {
    debug: boolean;
    info: boolean;
    warning: boolean;
    error: boolean;
    critical: boolean;
    alert: boolean;
    emergency: boolean;
}

/**
 * Yolog logging handler.
 */
declare class Yolog {
    public constructor(plugins?: any[], tags?: Tags);

    /**
     * Use the logger as an event handler and add a callback that will fire on a specific tag.
     *
     * @param tag Tag to listen for.
     * @param handler Handler to call.
     * @param priority Priority for the event handlers internal sorting.
     * @return Handler id, can be used to turn the handler off if the callback is not available.
     */
    public on(tag: string, handler: Function, priority: number): number;
    /**
     * Remove a listener from a given tag.
     *
     * @param {String} tag Tag to remove the specific handler from.
     * @param handler Handler as callback or ID.
     */
    public off(tag: string, handler: number | Function): boolean;
    /**
     * Use the logger as an event handler and add a callback that will fire one time on a specific tag.
     *
     * @param tag Tag to listen for.
     * @param handler Handler to call.
     * @param priority Priority for the event handlers internal sorting.
     * @return Handler id, can be used to turn the handler off if the callback is not available.
     */
    public once(tag: string, handler: Function, priority?: number): number;
    /**
     * Change the currently used timestamp method.
     * Defaults to `() => { return (new Date()).getTime() };`
     *
     * @param func Function to use.
     * @return Self.
     */
    public setTimestampFunction(func: () => number): Yolog;
    /**
     * Get a list of tags that are active.
     *
     * @return List of active tags.
     */
    public readonly active: string[];
    /**
     * Get all available tags.
     *
     * @return List of available tags.
     */
    public readonly available: string[];
    /**
     * Set a tag state to active or not active in the Yolog instance.
     * If state is omitted, the tag will be toggled to the negative of the current state.
     *
     * @param tag Tag name.
     * @param state State to set the tag to.
     * @return Self
     */
    public set(tag: string, state?: boolean): Yolog;
    /**
     * Get state of a specific tag in the Yolog instance.
     *
     * @param tag Tag to check.
     * @return Current state of the tag.
     */
    public get(tag: string): boolean;
    /**
     * Add a plugin to the current Yolog instance.
     *
     * @param plugin Plugin to add.
     * @return Self
     */
    public addPlugin(plugin: YologPlugin): Yolog;
    /**
     * Remove a plugin from current Yolog instance.
     *
     * @param plugin Plugin to remove.
     * @return Self
     */
    public removePlugin(plugin: YologPlugin): Yolog;
    /**
     * Call a custom tag not already defined.
     *
     * @param tag Tag name.
     * @param message Message to log.
     * @param args Argument list to pass to plugins for formatting.
     */
    public custom(tag: string, message: string, ...args: any[]): Promise<void>;
    /**
     * Log a debug message.
     *
     * @param message Message to log.
     * @param args Argument list to pass to plugins for formatting.
     */
    public debug(message: string, ...args: any[]): Promise<void>;
    /**
     * Log a info message.
     *
     * @param message Message to log.
     * @param args Argument list to pass to plugins for formatting.
     */
    public info(message: string, ...args: any[]): Promise<void>;
    /**
     * Log a warning message.
     *
     * @param message Message to log.
     * @param args Argument list to pass to plugins for formatting.
     */
    public warning(message: string, ...args: any[]): Promise<void>;
    /**
     * Log an error message.
     *
     * @param message
     * @param args Argument list to pass to plugins for formatting.
     */
    public error(message: string, ...args: any[]): Promise<void>;
    /**
     * Log a critical message.
     *
     * @param message Message to log.
     * @param args Argument list to pass to plugins for formatting.
     */
    public critical(message: string, ...args: any[]): Promise<void>;
    /**
     * Log an alert message.
     *
     * @param message Message to log.
     * @param args Argument list to pass to plugins for formatting.
     */
    public alert(message: string, ...args: any[]): Promise<void>;
    /**
     * Log an emergency message.
     *
     * @param message Message to log.
     * @param args Argument list to pass to plugins for formatting.
     */
    emergency(message: string, ...args: any[]): Promise<void>;
}

export default Yolog;
export { Yolog, YologPlugin, YologPlugin as Plugin };
