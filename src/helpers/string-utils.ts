export const FixedEncodeURI = (str: string) => {
  return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
};

export const FindHashtags = (string) => {
  const regex = /(?:^|\s)(?:#)([a-zA-ZäüößÄÖÜ\d]+)/gm;
  const matches = [];
  let match;
  while ((match = regex.exec(string))) {
    matches.push(match[1]);
  }
  return matches;
}

export const FindUserMention = (string) => {
  const regex = /(?:^|\s)(?:@)([a-zA-Z0-9_\-\.\d]+)/gm;
  const matches = [];
  let match;
  while ((match = regex.exec(string))) {
    matches.push(match[1]);
  }
  return matches;
}

export const UserMentionToLink = (string, link= '/profile/$1') => {
  if (string) {
    const regex = /(?:^|\s)(?:@)([a-zA-Z0-9_\-\.]+)/gm;
    return string.replace(regex, ' <ion-router-link style="--color:#ED4C27" href="'+link+'">@$1</ion-router-link>');
  }
}

export const HashTagToLink = (string) => {
  if (string) {
    const regex = /(?:^|\s)(?:#)([a-zA-ZäüößÄÖÜ\d]+)/gm;
    return string.replace(regex, ' <ion-router-link style="--color:#ED4C27"  href="/t/$1">#$1</ion-router-link>');
  }
}

export const FixedEncodeURIComponent = (str) => {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
    return '%' + c.charCodeAt(0).toString(16)
  })
};

export const FixedDecodeURIComponent = (str) => {
  return decodeURIComponent(str);
};

export const FirstLetter = (value) => {
  if (value) {
    return value.charAt(0).toUpperCase();
  }
};

export const SnakeToCamel = (str) => {
  return str.replace(
    /([-_][a-z])/g,
    (group) => group.toUpperCase()
      .replace('-', '')
      .replace('_', ''))
};


export const GeneratePassword = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const ConvertServerError = (error, validationMessages) => {
  const collectedErrors = [];
  if (error) {
    Object.keys(error).forEach((key) => {
      if (validationMessages.hasOwnProperty(key)) {
        collectedErrors.push(validationMessages[key]);
      }
    });
  }
  return collectedErrors;
};

export const UniqueID = () => {

  function chr4() {
    return Math.random().toString(16).slice(-4);
  }

  return chr4() + chr4() +
    '-' + chr4() +
    '-' + chr4() +
    '-' + chr4() +
    '-' + chr4() + chr4() + chr4();
};

export const LCFirst = (str) => {
  return str.replace(/^\w/, c => c.toLowerCase());
};
