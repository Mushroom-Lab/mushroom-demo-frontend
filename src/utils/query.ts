import { HashUserInfo } from "./types";

export const requestIdFromHash = async (hash: string) => {

  // console.log(`https://connect.mushroom.social:3333/api/decrypt?hashCode=${hash}`)
  const response = await fetch(
    `https://connect.mushroom.social:3333/api/decrypt?hashCode=${hash}`, 
    { method: "GET" }
  );

  const result = await response.json();

  // console.log(result)
  return result as HashUserInfo
}

export const requestUserInfoFromBot = async (userId: string, guildId: string) => {

  console.log("userId", userId)
  console.log("guildId", guildId)

  console.log(`https://connect.mushroom.social:3333/api/fetch?guild_id=${guildId}&user_id=${userId}`)

  const response = await fetch(
    `https://connect.mushroom.social:3333/api/fetch?guild_id=${guildId}&user_id=${userId}`,
    { method: "GET" }
  );
  const result = await response.json();
  
  console.log("========== status", response.status)
  console.log("==========", result)

  return result
}



export const postUserInfoToCeramic = async (userId: string, guildId: string, level: string) => {
  const data = { user_id: userId, guild_id: guildId, level }
  console.log("data", data)
  const response = await fetch(
    "http://35.222.63.199:3300/ceramic/write_profile",
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const result = await response.json()

  return result
}

export const postSessionToDB = async (session: string, userId: string, guildId: string, address: string) => {
  const data = { session, user_id: userId, guild_id: guildId, address }
  const response = await fetch(
    "http://35.222.63.199:3300/ceramic/save_session",
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  
  return response.status
}
