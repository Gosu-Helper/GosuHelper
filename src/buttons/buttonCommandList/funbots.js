const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['fun-bots'],
    permissions: [],
    permLevel: 'User',
    group: [],
    execute: async function(p){
        let role = await p.fetchRole("875012914371768330")

        let fun = new p.embed()
        .setTitle("Fun Bots")
        .setDescription("In these channels")
        .addFields(
            {
                name: "Bot Fiesta", value: "<#497076896199344156>\n\n<@!270904126974590976> | Prefix is `/`\nEarn Dank Memer coins, buy items, and prestige. \nSome currency commands include: beg, search, bank, deposit, inventory, shop and much more.\n\n<@!172002275412279296> | Prefix is `t!` or `t`\nOwn a pet and earn some cash. \nSome commands include: tg, train, play, feed, credits, and much more.\n\n<@!292953664492929025> | Prefix is `u!`\nEarn some server currency and buy roles. \nSome commands include: collect, work, crime, withdraw, deposit, balance, shop and much more."
            },
            {
                name: "Owo", value: "<#720090984255586324>\n\n<@!408785106942164992> | Prefix is `Owo` or `h`\nHunt for different animals and create a team with your animals to battle. \nSome commands include: hunt, zoo, battle, team, cash, huntbot, sell, sacrifice, lootbox, weaponcrate, inventory and much more.\n"
            },
            {
                name: "Mudae", value: "<#533834316388630539>\n\n<@!432610292342587392> | Prefix is `$`\nGet married to waifus or husbandos. \nSome commands include: waifu, husbando, marry, divorce, rollsleft, mymarry, profile and much more.\n"
            },
            {
                name: "Slot, Ani, and Poke", value: "<#534089013116796958>\n\n<@!346353957029019648> | Prefix is `~` or `&`\nEarn huge amount of slotbot cash and own a (fake) cash farm. \nSome commands include: balance, deposit, withdraw, grab, inventory, farm, harvest, fertilize and much more.\n\n<@!571027211407196161> | Prefix is `.`\nCollect better cards and battle in stages, dungeons, and raids. \nSome commands include: start, inventory, info, team, cardinfo, gold, stamina, profile, battle, raid, and much more.\n\n<@!664508672713424926> | Prefix is `;`\nCollect pokemons and battle with them. \nSome commands include: pokemon, pokedex, box, shop, items, catchbot, eggs, market, battle, team, buddy, evolve, coins and much more.\n"
            },
            {
                name: "Roulette", value: "<#814180051444170779>\n\n<@!155149108183695360> | Prefix is `?`\nEarn some server currency by chance. \nCommands are dig, search and roulette.\n"
            },
            {
                name: "Kpop Quiz", value: "<#834788888232329246>\n\n<@!508759831755096074> | Prefix is `,`\nListen to kpop songs and guess the artist/song in <#834789233642307595>. \nSome commands include: play, listen, end, hint, skip and much more.\n"
            }
        )
        .setFooter("To view more commands on a specific bot type {prefix}help \nPS: remove the brackets {} and replace prefix with the bot's prefix.")
        .setColor(`${role.color.toString(16)||"HEART"}`)
        p.interaction.reply({embeds: [fun], ephemeral: true})
    }
})