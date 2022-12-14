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

export const requestUserInfoFromCeramic = async (userId: string, guildId: string) => {

  console.log("userId", userId)
  console.log("guildId", guildId)

  console.log(`https://connect.mushroom.social:3300/ceramic/get_profile?user_id=${userId}&guild_id=${guildId}`)

  const response = await fetch(
    `https://connect.mushroom.social:3300/ceramic/get_profile?user_id=${userId}&guild_id=${guildId}`,
    { method: "GET" }
  );
  const result = await response.json();
  
  console.log("========== status", response.status)
  console.log("==========", result)

  return result
}

export const postUserInfoToCeramic = async (userId: string, guildId: string, level: string, popularity_level: string, dm_content: string) => {
  const data = { user_id: userId, guild_id: guildId, level, popularity_level, dm_content }
  console.log("data", data)
  const response = await fetch(
    `https://connect.mushroom.social:3300/ceramic/write_profile`,
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
    `https://connect.mushroom.social:3300/ceramic/save_session`,
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


export const postDMToUser = async (content: string, userId: string) => {
  const data = { content }
  const response = await fetch(
    `https://connect.mushroom.social:3334/dm/${userId}`,
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

export const postAssignRole = async (userId: string, guildId: string) => {
  const data = { "user_id": userId, "guild_id": guildId, "role_id": "1022221111607439480" }
  const response = await fetch(
    `https://connect.mushroom.social:3334/roleassign`,
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
