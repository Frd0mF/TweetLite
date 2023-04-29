import type { User } from "@clerk/nextjs/dist/api";

export const filterUserForClient = (user: User) => {
  let username: string;
  if (user.username) {
    username = user.username;
  } else if (user.firstName && user.lastName) {
    username = `${user.firstName}_${user.lastName}`;
  } else {
    username = "No username";
  }
  return {
    id: user.id,
    username,
    profileImageUrl: user.profileImageUrl,
    createdAt: user.createdAt,
  };
};
