import { GeneralLeaderboard } from "../model";

export async function getUserPlace(
  allUsers: GeneralLeaderboard[],
  userAddress: string,
): Promise<number> {
  const sortedUsers = allUsers.sort((a, b) => {
    return b.balanceChange.cmp(a.balanceChange);
  });

  const userIndex = sortedUsers.findIndex((user) => user.id === userAddress);

  if (userIndex !== -1) {
    return userIndex + 1;
  } else {
    throw new Error("User not found");
  }
}
