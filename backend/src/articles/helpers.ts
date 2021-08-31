export const transformAuthorProperty = ({ value: author }) => {
  const { profile } = author;
  const { id, following, ...profileProps } = profile;
  return {
    username: author.username,
    ...profileProps,
    following: !!following,
  };
};
