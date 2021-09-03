import { classToPlain } from 'class-transformer';

// TODO: Add types
export const splitUpdateProperties = (data = {}, userObject) => {
  const parsedUser = classToPlain(userObject);
  const userKeys = Object.keys(parsedUser);
  const profileProperties = Object.keys(data).reduce((acc, key) => {
    if (userKeys.includes(key)) return acc;
    return { ...acc, [key]: data[key] };
  }, {});
  // return Object.keys(profileProperties).length > 0 && profileProperties;
  return {
    userProperties: {},
    profileProperties: {},
  };
};
