const { PermissionFlagsBits } = require('discord-api-types/v10');

class Permission {
    /**
        * Numeric permission flags.
        * @type {PermissionFlagsBits}
        * @memberof permission
        * @see {@link https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags}
    */
    static Permissions = PermissionFlagsBits;
    log(){
        console.log(Permission.Permissions)
    }
}

module.exports = Permission