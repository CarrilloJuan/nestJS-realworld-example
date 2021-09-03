import { classToPlain } from 'class-transformer';

// TODO: Add types
export const splitUpdateProperties = (data = {}, userObject) => {
  const { profile, ...user } = classToPlain(userObject);
  const userKeys = Object.keys(user);
  const profileKeys = Object.keys(profile);

  const splitProperties = Object.keys(data).reduce(
    (acc, key) => {
      if (userKeys.includes(key))
        return {
          ...acc,
          userProperties: {
            ...acc.userProperties,
            [key]: data[key],
          },
        };
      if (profileKeys.includes(key))
        return {
          ...acc,
          profileProperties: {
            ...acc.profileProperties,
            [key]: data[key],
          },
        };
      return acc;
    },
    {
      userProperties: {},
      profileProperties: {},
    },
  );

  return splitProperties;
};
