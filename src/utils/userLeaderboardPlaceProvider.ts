import { GeneralLeaderboard } from "../model";

export async function getUserPlace(
  allUsers: GeneralLeaderboard[],
  userAddress: string,
): Promise<number> {
  const userIndex = allUsers.findIndex((user) => user.id === userAddress);

  if (userIndex !== -1) {
    return userIndex + 1;
  } else {
    throw new Error("User not found");
  }
}
