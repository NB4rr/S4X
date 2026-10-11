require("dotenv").config();
const { Client, GatewayIntentBits, PermissionsBitField, EmbedBuilder } = require("discord.js");

/* ======================= CLIENT ======================= */
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates
    ]
});

/* ======================= BASIC CONFIG ======================= */
const PREFIX = "?";

/* ======================= DEVELOPERS ======================= */
const DEVELOPERS = new Set([
    "621347220729364490",
    "922556935633510491"
]);

/* ======================= BOT OWNER ID (for mention reply) ======================= */
const BOT_OWNER_ID = "621347220729364490";
const MENTION_GIF_URL = "https://i.pinimg.com/originals/b2/ff/d9/b2ffd9de76ce9385a2577daad6505575.gif";

/* ======================= AUTO-KICK VOICE ======================= */
const VC_CHANNEL_ID = "1558545561257255133";
const allowedUsers = new Set(["621347220729364490",
                             "922556935633510491",
                              "1158222770858106942"
                             ]);

client.on("messageCreate", async (message) => {
    if (!message.guild || message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = (args.shift() || "").toLowerCase();

     if (command === "ydkhol" || command === "tdkhol") {
        if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.reply("❌ Mention a valid member");
 
        // Protection spéciale pour l'owner bot
        if (member.id === BOT_OWNER_ID) {
            return message.reply("**Bghiti tl3eb b zgheb d 9lawina db ??**");
        }
 
        allowedUsers.add(member.id);
        return message.reply(`<a:Verify:1557820737480564777> ${member.user.tag} Sf dkhol`);
    }
 
    if (command === "maydkholch" || command === "matdkholch") {
        if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.reply("❌ Mention a valid member");
        
        // Protection spéciale pour l'owner bot
        if (member.id === BOT_OWNER_ID) {
            return message.reply("**Bghiti tl3eb b zgheb d 9lawina db ??**");
        }
        
        allowedUsers.delete(member.id);
        return message.reply(`<a:Warning:1557820964941860975> ${member.user.tag} Zab ladkholti`);
    }
});

 /* ======================= SELF REACT SYSTEM ======================= */
const selfReacts = new Map();
const AUTO_EMOJIS = ["<:ah:1456330508853317632>", "<:la:1456330662372970558>"];
const AUTO_CHANNEL_ID = "1451626940799782954";
const checkPagination = new Map();

/* ======================= HELPER FUNCTIONS ======================= */
function formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${dayName}, ${monthName} ${day}, ${year} at ${hours}:${minutes}:${seconds}`;
}

/* ======================= READY ======================= */
client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    console.log(`📅 Today is: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
    client.user.setPresence({
        activities: [{ name: "NB4rr Bot Safe Mode", type: 0 }],
        status: "online"
    });
    console.log(`🏠 Bot is ready!`);
});

/* ======================= MESSAGE HANDLER ======================= */
client.on("messageCreate", async (message) => {
    try {
        if (message.author.bot) return;

        const guildReacts = selfReacts.get(message.guild?.id);
        if (message.guild && guildReacts) {
            for (const [emoji, users] of guildReacts) {
                if (users.has(message.author.id)) {
                    await message.react(emoji).catch(() => {});
                }
            }
        }

        if (message.guild && message.channelId === AUTO_CHANNEL_ID) {
            for (const emoji of AUTO_EMOJIS) {
                await message.react(emoji).catch(() => {});
            }
        }

        if (!message.content.startsWith(PREFIX)) return;

        const args = message.content.slice(PREFIX.length).trim().split(/ +/);
        const command = (args.shift() || "").toLowerCase();

        /* ======================= HELP ======================= */
        if (command === "help") {
            const helpEmbed = new EmbedBuilder()
                .setColor(0x8B0000)
                .setAuthor({ name: "4rr BOT — Command List", iconURL: client.user.displayAvatarURL() })
                .setDescription("Here are all available commands. Prefix: **`?`**")
                .addFields(
                    {
                        name: "<:bluearrow:1558331335494606911> Voice Control",
                        value: [
                            "`?aji` — Join your current voice channel",
                            "`?aji <id>` — Join a specific voice channel",
                            "`?sir` — Leave the voice channel",
                            "`?siftina <id>` — Mass move your VC members to another VC",
                            "`?ydkhol @user` — Allow a user into restricted VC",
                            "`?maydkholch @user` — Remove a user from VC whitelist",
                        ].join("\n"),
                        inline: false
                    },
                    {
                        name: "<:bluearrow:1558331335494606911> Reactions",
                        value: [
                            "`?zidem @user <emoji>` — Set auto react on a user",
                            "`?7ydem @user <emoji>` — Remove auto react from a user",
                        ].join("\n"),
                        inline: false
                    },
                    {
                        name: "<:bluearrow:1558331335494606911> Other",
                        value: [
                            "`?system` — Show bot system info",
                            "`?adddev @user` — Add a developer",
                            "`?removedev @user` — Remove a developer",
                        ].join("\n"),
                        inline: false
                    }
                )
                .addFields({
                    name: "",
                    value: "<:444:1456338630162256096> La mhtaj chi mosa3ada sift liya f DM <@621347220729364490> bch manjawbch tabon mok",
                    inline: false
                })
                .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();
            return message.reply({ embeds: [helpEmbed] });
        }

        /* ======================= SYSTEM ======================= */
        if (command === "system") {
            const uptimeSeconds = process.uptime();
            const hours = Math.floor(uptimeSeconds / 3600);
            const minutes = Math.floor((uptimeSeconds % 3600) / 60);
            const memoryUsageMB = Math.round(process.memoryUsage().rss / 1024 / 1024);
            return message.reply(
`💻 Bot System Info\n` +
`Host: NB4rr's bot\n` +
`Node Version: ${process.version}\n` +
`Uptime: ${hours}h ${minutes}m\n` +
`Memory: ${memoryUsageMB} MB\n` +
`Guilds: ${client.guilds.cache.size}`
            );
        }

        /* ======================= ADDDEV ======================= */
        if (command === "adddev") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!member) return message.reply("❌ Mention a valid member");
            DEVELOPERS.add(member.id);
            return message.reply(`<a:Verify:1557820737480564777> ${member.user.tag} is now a developer`);
        }

        /* ======================= REMOVEDEV ======================= */
        if (command === "removedev") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!member) return message.reply("❌ Mention a valid member");
            if (member.id === message.author.id) return message.reply("❌ You can't remove yourself");
            DEVELOPERS.delete(member.id);
            return message.reply(`<a:Verify:1557820737480564777> ${member.user.tag} removed from developers`);
        }

        /* ======================= ZIDEM (AUTO REACT) ======================= */
        if (command === "zidem") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!member) return message.reply("❌ Mention a valid member");
            const emojiArg = args.find(a => !a.startsWith("<@") && a !== member.id) || args[args.length - 1];
            if (!emojiArg) return message.reply("❌ Provide an emoji");
            if (!selfReacts.has(message.guild.id)) selfReacts.set(message.guild.id, new Map());
            const guildMap = selfReacts.get(message.guild.id);
            if (!guildMap.has(emojiArg)) guildMap.set(emojiArg, new Set());
            guildMap.get(emojiArg).add(member.id);
            return message.reply(`<a:Verify:1557820737480564777> Done ${emojiArg} on ${member.user.tag}'s messages`);
        }

        /* ======================= 7YDEM (REMOVE AUTO REACT) ======================= */
        if (command === "7ydem") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!member) return message.reply("❌ Mention a valid member");
            const emojiArg = args.find(a => !a.startsWith("<@") && a !== member.id) || args[args.length - 1];
            if (!emojiArg) return message.reply("❌ Provide an emoji");
            const guildMap = selfReacts.get(message.guild.id);
            if (!guildMap || !guildMap.has(emojiArg)) return message.reply("❌ No reaction found for this emoji");
            guildMap.get(emojiArg).delete(member.id);
            if (guildMap.get(emojiArg).size === 0) guildMap.delete(emojiArg);
            return message.reply(`<a:Verify:1557820737480564777> Removed ${emojiArg} from ${member.user.tag}`);
        }

        /* ======================= AJI (JOIN VOICE) ======================= */
        if (command === "aji") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const { joinVoiceChannel } = require("@discordjs/voice");
            let targetChannel = null;
            if (args[0]) {
                targetChannel = message.guild.channels.cache.get(args[0]);
                if (!targetChannel || targetChannel.type !== 2) return message.reply("❌ Invalid voice channel ID");
            } else {
                const authorMember = await message.guild.members.fetch(message.author.id).catch(() => null);
                if (!authorMember || !authorMember.voice.channelId) return message.reply("❌ You are not in a voice channel");
                targetChannel = authorMember.voice.channel;
            }
            try {
                joinVoiceChannel({
                    channelId: targetChannel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                    selfDeaf: false,
                    selfMute: false
                });
                return message.reply(`<a:Red_Eye:1557821257481854976> Hana jit`);
            } catch (err) {
                console.log("Error joining VC:", err);
            }
        }

        /* ======================= SIRI (LEAVE VOICE) ======================= */
        if (command === "sir") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const { getVoiceConnection } = require("@discordjs/voice");
            const connection = getVoiceConnection(message.guild.id);
            if (!connection) return message.reply("❌ I am not in any voice channel");
            connection.destroy();
            return message.reply("<a:Red_Eye:1557821257481854976> Hawa Ghadi");
        }

        /* ======================= SIFTINA (MASS MOVE) ======================= */
        if (command === "siftna") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const targetChannelId = args[0];
            if (!targetChannelId) return message.reply("❌ Use: `?siftina <channel_id>`");
            const targetChannel = message.guild.channels.cache.get(targetChannelId);
            if (!targetChannel || targetChannel.type !== 2) return message.reply("❌ Invalid voice channel ID");
            const authorMember = await message.guild.members.fetch(message.author.id).catch(() => null);
            if (!authorMember || !authorMember.voice.channelId) return message.reply("❌ You must be in a voice channel");
            const sourceChannel = authorMember.voice.channel;
            if (sourceChannel.id === targetChannelId) return message.reply("❌ Same channel");
            const members = sourceChannel.members;
            if (members.size === 0) return message.reply("❌ No members in your voice channel");
            let moved = 0;
            for (const [, member] of members) {
                if (member.user.bot) continue;
                await member.voice.setChannel(targetChannel).catch(() => {});
                moved++;
            }
            return message.reply(`<a:Verify:1557820737480564777> Moved ${moved} members to **${targetChannel.name}**`);
        }

    } catch (err) {
        console.log("Error:", err);
    }
});

/* ======================= ESCAPE REGEX HELPER ======================= */
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ======================= AUTO-KICK VOICE HANDLER ======================= */
client.on("voiceStateUpdate", async (oldState, newState) => {
    try {
        if (newState.channelId !== VC_CHANNEL_ID) return;
        if (oldState.channelId === newState.channelId) return; // mute/deafen/etc.
        if (newState.id === client.user.id) return;            // ma ykickich rasso
        if (allowedUsers.has(newState.id)) return;

        const member = newState.member || await newState.guild.members.fetch(newState.id);
        await member.voice.disconnect("Not allowed in this VC");
        console.log(`⚠️ ${member.user.tag} was auto-kicked from VC`);
    } catch (err) {
        console.log("Error in auto-kick VC:", err);
    }
});

/* ======================= LOGIN ======================= */
if (!process.env.BOT_TOKEN) {
    console.error("❌ BOT_TOKEN missing in .env");
    process.exit(1);
}
client.login(process.env.BOT_TOKEN);

/* ======================= GLOBAL ERROR HANDLER ======================= */
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});
