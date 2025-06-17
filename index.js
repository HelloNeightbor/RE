const express = require("express");
const cors = require("cors"); // <== thêm dòng này
const { Client, GatewayIntentBits, Partials } = require("discord.js");
require("dotenv").config();


const app = express();
const PORT = 3000;
const GUILD_ID = "1287350045917581355";

app.use(cors()); // <== thêm dòng này

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

// Đăng nhập bot
client.login(process.env.DISCORD_TOKEN);

// Bot sẵn sàng
client.once("ready", async () => {
  console.log(`🤖 Bot đã đăng nhập với tên ${client.user.tag}`);

  const guild = await client.guilds.fetch(GUILD_ID);
  const idsToCheck = ["626404653139099648", "1130322698438967307"];

  for (const id of idsToCheck) {
    try {
const member = await guild.members.fetch(userId);
      console.log(`✅ ${member.user.username} có trong server`);
    } catch {
      console.log(`❌ Không tìm thấy userId ${id} trong server`);
    }
  }
});

// API lấy trạng thái người dùng
app.get("/discord-status", async (req, res) => {
  const userId = req.query.user;
  if (!userId) return res.status(400).json({ error: "Thiếu userId" });

  try {
const guild = await client.guilds.fetch(GUILD_ID);

    // Kiểm tra cache trước
    let member = guild.members.cache.get(userId);
    if (!member) {
      try {
        member = await guild.members.fetch(userId);
      } catch (err) {
        return res.status(404).json({ error: "Người dùng không tồn tại trong server." });
      }
    }

    const presence = member.presence;

    res.json({
      username: member.user.username,
      avatar: member.user.displayAvatarURL({ dynamic: true, size: 128 }),
      status: presence?.status || "offline",
      activity: presence?.activities?.[0]?.name || "Không hoạt động"
    });
  } catch (err) {
    console.error("❌ Lỗi khi lấy thông tin người dùng:", err);
    res.status(500).json({ error: "Không lấy được thông tin người dùng." });
  }
});

// Chạy express server
app.listen(PORT, () => {
  console.log(`🌐 Server đang chạy tại http://localhost:${PORT}`);
});