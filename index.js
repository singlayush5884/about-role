const { Client } = require('discord.js-selfbot-v13');
const client = new Client({
    checkUpdate: false
});

const config = require('./config')

client.on('ready', async () => {
    console.log(`${client.user.username} is ready!`);
    client.user.setActivity(`Hosted`)
})

client.on('channelCreate', async (channel) => {
    if (channel.parentId !== config.role_category) return;
    const collector = await channel.createMessageCollector({ time: 10000 })
    collector.on('collect', async (message) => {
        if (!config.ticket_bot_id.includes(message.author.id)) return;
        const data = message.mentions.members.first()
        const member = await client.api.users(data.user.id).profile.get()
        const bio = member.user_profile.bio
        if (bio.includes(config.vanity)) {
            if (!channel.guild.members.me.permissions.has('MANAGE_ROLES')) return channel.send('I dont have \`MANAGE ROLES\` permission.')
            const role = await channel.guild.roles.cache.get(config.newbie_role)
            if (!role) return channel.send(`There is no role specified`)
            try {
                await data.roles.add(role)
                channel.send(`You got the newbie role`)
            } catch (err) {
                console.log(err)
                channel.send('error occured!')
            }
        } else {
            channel.send(`Add **.gg/${config.vanity}** in your about and recreate the ticket`)
        }

        setTimeout(async () => {
            await channel.send(`$delete`)
        }, 10000)
    })
})

client.login(config.token);